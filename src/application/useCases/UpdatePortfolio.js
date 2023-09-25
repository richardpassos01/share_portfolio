import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums.js';

export default class UpdatePortfolio {
  constructor(
    shareRepository,
    transactionRepository,
    getShare,
    createShare,
    updateShare,
    getMonthlyBalance,
    createMonthlyBalance,
    updateMonthlyBalance,
    getTotalBalance,
    updateTotalBalance,
  ) {
    this.shareRepository = shareRepository;
    this.transactionRepository = transactionRepository;
    this.getShare = getShare;
    this.createShare = createShare;
    this.updateShare = updateShare;
    this.getMonthlyBalance = getMonthlyBalance;
    this.createMonthlyBalance = createMonthlyBalance;
    this.updateMonthlyBalance = updateMonthlyBalance;
    this.getTotalBalance = getTotalBalance;
    this.updateTotalBalance = updateTotalBalance;
  }

  async execute(transaction) {
    try {
      const monthlyBalance = await this.getOrCreateMonthlyBalance(transaction);
      const totalBalance = await this.getTotalBalance.execute(
        transaction.getInstitutionId(),
      );

      if (transaction.getCategory() === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.handleDividends(transaction, monthlyBalance, totalBalance);
      }

      if (transaction.getType() === TRANSACTION_TYPE.BUY) {
        return this.handleBuyOperation(transaction);
      }

      if (transaction.getType() === TRANSACTION_TYPE.SELL) {
        return this.handleSellOperation(
          transaction,
          monthlyBalance,
          totalBalance,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleDividends(transaction, monthlyBalance, totalBalance) {
    monthlyBalance.setWins(transaction.getTotalCost());
    totalBalance.setWins(transaction.getTotalCost());

    return Promise.all([
      this.updateMonthlyBalance.execute(monthlyBalance),
      this.updateTotalBalance.execute(totalBalance),
    ]);
  }

  async handleBuyOperation(transaction) {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      return this.createShare.execute(transaction);
    }

    share.updatePosition(transaction);
    return this.updateShare.execute(share, transaction);
  }

  async handleSellOperation(transaction, monthlyBalance, totalBalance) {
    const share = await this.getShare.execute(transaction);
    const operationResult = UpdatePortfolio.calculateWinsOrLossOnSale(
      share,
      transaction,
    );
    share.updatePosition(transaction);

    const transactions =
      await this.transactionRepository.getSellTransactionsByDate(
        transaction.getInstitutionId(),
        transaction.getDate(),
      );

    monthlyBalance.setType(transactions);

    if (operationResult < 0) {
      totalBalance.setLoss(operationResult);
      monthlyBalance.setLoss(operationResult);
    }

    if (operationResult > 0) {
      monthlyBalance.setWins(operationResult);
      monthlyBalance.setTaxes(transactions, totalBalance.getLoss());
      totalBalance.setWins(operationResult - monthlyBalance.getTaxes());
    }

    await Promise.all([
      this.updateShare.execute(share, transaction),
      this.updateMonthlyBalance.execute(monthlyBalance),
      this.updateTotalBalance.execute(totalBalance),
    ]);

    return this.handleLiquidation(share);
  }

  async handleLiquidation(share) {
    if (share.getQuantity() === 0) {
      return this.shareRepository.delete(share);
    }
  }

  async getOrCreateMonthlyBalance({ institutionId, date }) {
    const monthlyBalance = await this.getMonthlyBalance.execute(
      institutionId,
      date,
    );
    if (!monthlyBalance) {
      return this.createMonthlyBalance.execute(institutionId, date);
    }
    return monthlyBalance;
  }

  static calculateWinsOrLossOnSale(share, transaction) {
    const sellCost = transaction.getTotalCost();
    const minIdealSellCost = transaction.getQuantity() * share.getMediumPrice();
    const winsOrLoss = sellCost - minIdealSellCost;
    return winsOrLoss;
  }
}

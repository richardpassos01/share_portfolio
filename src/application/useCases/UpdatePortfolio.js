import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums.js';

export default class UpdatePortfolio {
  constructor(
    shareRepository,
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
      const totalBalance = await this.getTotalBalance(
        transaction.institutionId,
      );

      if (transaction.category === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.handleDividends(transaction, monthlyBalance, totalBalance);
      }

      if (transaction.type === TRANSACTION_TYPE.BUY) {
        return this.handleBuyOperation(transaction);
      }

      if (transaction.type === TRANSACTION_TYPE.SELL) {
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
    monthlyBalance.setWins(transaction.totalCost);
    totalBalance.setWins(transaction.totalCost);

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
    const share = this.getShare.execute(transaction);
    const operationResult = UpdatePortfolio.calculateWinsOrLossOnSale(
      share,
      transaction,
    );
    share.updatePosition(transaction);

    const transactions =
      await this.transactionRepository.getSellTransactionFromPeriod(
        transaction.date,
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
    if (share.quantity === 0) {
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
    const sellCost = transaction.totalCost;
    const minIdealSellCost = transaction.quantity * share.getMediumPrice();
    const winsOrLoss = sellCost - minIdealSellCost;
    return winsOrLoss;
  }
}

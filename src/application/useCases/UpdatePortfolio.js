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
      const monthlyBalance = await this.getOrCreateMonthlyBalance(
        transaction.getInstitutionId(),
        transaction.getDate(),
      );
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
    return this.updateShare.execute(share);
  }

  async handleSellOperation(transaction, monthlyBalance, totalBalance) {
    const share = await this.getShare.execute(transaction);
    const operationResult = UpdatePortfolio.calculateWinsOrLossOnSale(
      share,
      transaction,
    );

    share.updatePosition(transaction);

    const monthTransactions =
      await this.transactionRepository.getTransactionsFromMonth(
        transaction.getInstitutionId(),
        transaction.getDate(),
      );

    const buyTransactions = UpdatePortfolio.filterTransactionByType(
      monthTransactions,
      TRANSACTION_TYPE.BUY,
    );
    const sellTransactions = UpdatePortfolio.filterTransactionByType(
      monthTransactions,
      TRANSACTION_TYPE.SELL,
    );

    monthlyBalance.setType(buyTransactions, sellTransactions);

    if (operationResult < 0) {
      totalBalance.setLoss(operationResult); // check
      monthlyBalance.setLoss(operationResult);
    }

    if (operationResult > 0) {
      const tax = monthlyBalance.calculateTax(
        sellTransactions,
        operationResult,
        totalBalance.getLoss(),
      );
      monthlyBalance.setTaxes(tax);
      monthlyBalance.setWins(operationResult - tax);

      totalBalance.deductTaxFromLoss(tax);
      monthlyBalance.setWins(operationResult - tax);
      // totalBalance.setWins(operationResult);
      // no get TotalBalance.wins, deduzir loss e taxes
    }

    await Promise.all([
      this.handleLiquidation(share),
      this.updateMonthlyBalance.execute(monthlyBalance),
      this.updateTotalBalance.execute(totalBalance),
    ]);
  }

  async handleLiquidation(share) {
    if (share.getQuantity() === 0) {
      return this.shareRepository.delete(share);
    }
    return this.updateShare.execute(share);
  }

  async getOrCreateMonthlyBalance(institutionId, date) {
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

  static filterTransactionByType(transactions, type) {
    return transactions.filter((transaction) => transaction.type === type);
  }
}

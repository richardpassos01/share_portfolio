import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums.js';
import { MONTHLY_BALANCE_TYPE } from '../../domain/monthlyBalance/MonthlyBalanceEnums.js';

const TAX_FREE_SALES_LIMIT = 20000;
const DAY_TRADE_TAX_PERCENTAGE = 0.2;
const SWING_TRADE_TAX_PERCENTAGE = 0.15;

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
      const totalBalance = await this.getTotalBalance.execute(
        transaction.getInstitutionId(),
      );

      if (transaction.getCategory() === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.handleDividends(transaction, totalBalance);
      }

      if (transaction.getType() === TRANSACTION_TYPE.BUY) {
        return this.handleBuyOperation(transaction);
      }

      if (transaction.getType() === TRANSACTION_TYPE.SELL) {
        return this.handleSellOperation(transaction, totalBalance);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleDividends(transaction, totalBalance) {
    const monthlyBalance = await this.getMonthlyBalance.execute(
      transaction.getInstitutionId(),
      transaction.getDate(),
    );

    monthlyBalance.setGrossWins(
      monthlyBalance.getGrossWins() + transaction.getTotalCost(),
    );
    monthlyBalance.setNetWins(
      monthlyBalance.getNetWins() + transaction.getTotalCost(),
    );
    totalBalance.setWins(totalBalance.getWins() + transaction.getTotalCost());

    return Promise.all([
      this.updateMonthlyBalance.execute(monthlyBalance),
      this.updateTotalBalance.execute(totalBalance),
    ]);
  }

  async handleBuyOperation(transaction) {
    await this.getOrCreateMonthlyBalance(
      transaction.getInstitutionId(),
      transaction.getDate(),
    );

    const share = await this.getShare.execute(transaction);

    if (!share) {
      return this.createShare.execute(transaction);
    }
    share.updatePosition(transaction);
    return this.updateShare.execute(share);
  }

  async handleSellOperation(transaction, totalBalance) {
    const monthlyBalance = await this.getMonthlyBalance.execute(
      transaction.getInstitutionId(),
      transaction.getDate(),
    );

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
      const totalLoss = Math.abs(operationResult);

      monthlyBalance.setLoss(totalLoss);
      monthlyBalance.setGrossWins(monthlyBalance.getGrossWins() - totalLoss);
      monthlyBalance.setNetWins(
        monthlyBalance.getNetWins() - monthlyBalance.getLoss(),
      );

      totalBalance.setLoss(totalBalance.getLoss() + totalLoss);
      totalBalance.setWins(totalBalance.getWins() - totalLoss);
    }

    if (operationResult > 0) {
      await UpdatePortfolio.calculateTax(
        sellTransactions,
        operationResult,
        monthlyBalance,
        totalBalance,
      );
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

  // will become use case
  static async calculateTax(
    sellTransactions,
    wins,
    monthlyBalance,
    totalBalance,
  ) {
    const totalSold = sellTransactions.reduce(
      (acc, transaction) => acc + transaction.totalCost,
      0,
    );

    let tax = 0;

    if (totalSold > TAX_FREE_SALES_LIMIT) {
      tax = wins * SWING_TRADE_TAX_PERCENTAGE;
    }

    if (monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.DAY_TRADE) {
      tax = wins * DAY_TRADE_TAX_PERCENTAGE;
    }

    if (totalBalance.getLoss() > 0 && tax > 0) {
      const taxDeductedFromLoss = tax - totalBalance.getLoss();

      const isRemainingTotalLoss = taxDeductedFromLoss < 0;

      if (isRemainingTotalLoss) {
        tax = 0;
        totalBalance.setLoss(Math.abs(taxDeductedFromLoss));
      } else {
        totalBalance.setLoss(0);
        tax = taxDeductedFromLoss;
      }
    }

    monthlyBalance.setTaxes(tax);
    monthlyBalance.setGrossWins(monthlyBalance.getGrossWins() + wins);
    monthlyBalance.setNetWins(monthlyBalance.getNetWins() + (wins - tax));

    totalBalance.setWins(
      totalBalance.getWins() +
        monthlyBalance.getNetWins() -
        totalBalance.getLoss(),
    );
  }
}

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
      const monthlyBalance = await this.getOrCreateMonthlyBalance(
        transaction.getInstitutionId(),
        transaction.getDate(),
      );

      const totalBalance = await this.getTotalBalance.execute(
        transaction.getInstitutionId(),
      );

      if (transaction.getCategory() === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.handleDividends(transaction, monthlyBalance);
      }

      if (
        transaction.getCategory() === TRANSACTION_CATEGORY.SPLIT ||
        transaction.getCategory() === TRANSACTION_CATEGORY.BONUS_SHARE
      ) {
        return this.handleBonusAndSplitShare(transaction, monthlyBalance);
      }

      if (transaction.getCategory() === TRANSACTION_CATEGORY.TRADE) {
        if (transaction.getType() === TRANSACTION_TYPE.BUY) {
          return this.handleBuyOperation(transaction);
        }

        if (transaction.getType() === TRANSACTION_TYPE.SELL) {
          return this.handleSellOperation(
            transaction,
            totalBalance,
            monthlyBalance,
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleBonusAndSplitShare(transaction) {
    const share = await this.getShare.execute(transaction);
    const quantity = share.getQuantity() + transaction.getQuantity();

    share.setQuantity(quantity);
    return this.updateShare.execute(share);
  }

  async handleDividends(transaction, monthlyBalance) {
    monthlyBalance.setDividendEarnings(transaction.getTotalCost());
    monthlyBalance.setNetWins();

    return this.updateMonthlyBalance.execute(monthlyBalance);
  }

  async handleBuyOperation(transaction) {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      return this.createShare.execute(transaction);
    }
    share.updatePosition(transaction);
    return this.updateShare.execute(share);
  }

  async handleSellOperation(transaction, totalBalance, monthlyBalance) {
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
      UpdatePortfolio.updateTax(monthlyBalance, totalBalance, totalLoss);
    }

    if (operationResult > 0) {
      UpdatePortfolio.handleTax(
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
    try {
      const sellCost = transaction.getTotalCost();
      const minIdealSellCost =
        transaction.getQuantity() * share.getMediumPrice();
      const winsOrLoss = sellCost - minIdealSellCost;
      return winsOrLoss;
    } catch (err) {
      console.log(err);
    }
  }

  static filterTransactionByType(transactions, type) {
    return transactions.filter((transaction) => transaction.type === type);
  }

  static handleTax(sellTransactions, wins, monthlyBalance, totalBalance) {
    monthlyBalance.setTradeEarnings(monthlyBalance.getTradeEarnings() + wins);

    const totalSold = sellTransactions.reduce(
      (acc, transaction) => acc + transaction.totalCost,
      0,
    );

    if (
      totalSold > TAX_FREE_SALES_LIMIT ||
      monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.DAY_TRADE
    ) {
      UpdatePortfolio.calculateTax(monthlyBalance, totalBalance);
    } else {
      monthlyBalance.setNetWins();
    }
  }

  static updateTax(monthlyBalance, totalBalance, totalLoss) {
    const loss = Math.abs(totalLoss);
    monthlyBalance.setTradeEarnings(
      Math.max(0, monthlyBalance.getTradeEarnings() - loss),
    );
    monthlyBalance.setLoss(monthlyBalance.getLoss() + loss);

    if (monthlyBalance.getTaxes() <= 0) {
      totalBalance.setLoss(totalBalance.getLoss() + loss);
      monthlyBalance.setNetWins();
      return;
    }

    UpdatePortfolio.calculateTax(monthlyBalance, totalBalance);
  }

  static calculateTax(monthlyBalance, totalBalance) {
    const eligibleToChargeTax = Math.max(
      0,
      monthlyBalance.getTradeEarnings() -
        monthlyBalance.getLoss() -
        monthlyBalance.getDividendEarnings(),
    );
    let tax = 0;

    if (monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.SWING_TRADE) {
      tax = eligibleToChargeTax * SWING_TRADE_TAX_PERCENTAGE;
    }

    if (monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.DAY_TRADE) {
      tax = eligibleToChargeTax * DAY_TRADE_TAX_PERCENTAGE;
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
    monthlyBalance.setNetWins();
  }
}

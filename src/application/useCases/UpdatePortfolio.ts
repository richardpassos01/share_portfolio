import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums';
import {
  MONTHLY_BALANCE_TYPE,
  MONTHLY_SALES_LIMIT,
} from '../../domain/monthlyBalance/MonthlyBalanceEnums';

const TAX_PERCENTAGE = {
  SWING_TRADE: 0.15,
  DAY_TRADE: 0.2,
};

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
    const earning = UpdatePortfolio.calculateEarning(share, transaction);

    share.updatePosition(transaction);

    const monthTransactions =
      await this.transactionRepository.getFromMonth(
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

    const monthlySales = sellTransactions.reduce(
      (acc, sellTransaction) => acc + sellTransaction.getTotalCost(),
      0,
    );

    monthlyBalance.setType(buyTransactions, sellTransactions);

    if (transaction.totalCost > MONTHLY_SALES_LIMIT) {
      monthlyBalance.setTaxWithholding(transaction.totalCost);
    }

    if (earning < 0) {
      const totalLoss = Math.abs(earning);
      UpdatePortfolio.handleLoss(monthlyBalance, totalBalance, totalLoss);
    }

    if (earning > 0) {
      UpdatePortfolio.handleEarnings(
        monthlySales,
        earning,
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

  static calculateEarning(share, transaction) {
    try {
      const sellCost = transaction.getTotalCost();
      const minIdealSellCost =
        transaction.getQuantity() * share.getMediumPrice();
      const earning = sellCost - minIdealSellCost;
      return earning;
    } catch (err) {
      console.log(err);
    }
  }

  static filterTransactionByType(transactions, type) {
    return transactions.filter((transaction) => transaction.type === type);
  }

  static handleEarnings(monthlySales, earning, monthlyBalance, totalBalance) {
    monthlyBalance.setTradeEarnings(
      monthlyBalance.getTradeEarnings() + earning,
    );

    // Inter bank is charging tax for all sales transactions above 20k. Which is incorrect. I am analyzing it together with the bank
    // this is the right way
    // if (monthlySales > MONTHLY_SALES_LIMIT) {
    //   monthlyBalance.setTaxWithholding(monthlyBalance.getTradeEarnings());
    // }

    if (
      monthlySales > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX ||
      monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.DAY_TRADE
    ) {
      UpdatePortfolio.calculateTax(monthlyBalance, totalBalance);
    }
  }

  static handleLoss(monthlyBalance, totalBalance, totalLoss) {
    monthlyBalance.setLoss(totalLoss);
    totalBalance.setLoss(totalBalance.getLoss() + totalLoss);

    if (monthlyBalance.getTax() <= 0) {
      return;
    }

    UpdatePortfolio.calculateTax(monthlyBalance, totalBalance);
  }

  static calculateTax(monthlyBalance, totalBalance) {
    const tradetEarning = monthlyBalance.getTradeEarnings();

    let tax =
      tradetEarning * TAX_PERCENTAGE[monthlyBalance.getType()] -
      monthlyBalance.getTaxWithholding();

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

    monthlyBalance.setTax(tax);
  }
}

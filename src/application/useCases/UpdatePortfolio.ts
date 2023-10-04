import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '@domain/shared/constants';
import {
  MONTHLY_BALANCE_TYPE,
  MONTHLY_BALANCE_SALES_LIMIT,
} from '@domain/monthlyBalance/MonthlyBalanceEnums';
import { inject, injectable } from 'inversify';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import GetShare from './GetShare';
import UpdateShare from './UpdateShare';
import CreateShare from './CreateShare';
import GetMonthlyBalance from './GetMonthlyBalance';
import CreateMonthlyBalance from './CreateMonthlyBalance';
import UpdateMonthlyBalance from './UpdateMonthlyBalance';
import GetTotalBalance from './GetTotalBalance';
import UpdateTotalBalance from './UpdateTotalBalance';
import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import MonthlyBalance from '@domain/monthlyBalance/MonthlyBalance';
import TotalBalance from '@domain/totalBalance/TotalBalance';
import Share from '@domain/share/Share';

const TAX_PERCENTAGE = {
  SWING_TRADE: 0.15,
  DAY_TRADE: 0.2,
};

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepository,

    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepository,

    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.CreateShare)
    private readonly createShare: CreateShare,

    @inject(TYPES.UpdateShare)
    private readonly updateShare: UpdateShare,

    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.CreateMonthlyBalance)
    private readonly createMonthlyBalance: CreateMonthlyBalance,

    @inject(TYPES.UpdateMonthlyBalance)
    private readonly updateMonthlyBalance: UpdateMonthlyBalance,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,

    @inject(TYPES.UpdateTotalBalance)
    private readonly updateTotalBalance: UpdateTotalBalance,
  ) {}

  async execute(transaction: AbstractTransaction) {
    try {
      const monthlyBalance = await this.getOrCreateMonthlyBalance(transaction);

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
        return this.handleBonusAndSplitShare(transaction);
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

  async handleBonusAndSplitShare(transaction: AbstractTransaction) {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      return;
    }

    const quantity = share.getQuantity() + transaction.getQuantity();

    share.setQuantity(quantity);
    return this.updateShare.execute(share);
  }

  async handleDividends(
    transaction: AbstractTransaction,
    monthlyBalance: MonthlyBalance,
  ) {
    monthlyBalance.setDividendEarnings(transaction.getTotalCost());

    return this.updateMonthlyBalance.execute(monthlyBalance);
  }

  async handleBuyOperation(transaction: AbstractTransaction) {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      return this.createShare.execute(transaction);
    }
    share.updatePosition(
      transaction.getQuantity(),
      transaction.getTotalCost(),
      transaction.getType(),
    );
    return this.updateShare.execute(share);
  }

  async handleSellOperation(
    transaction: AbstractTransaction,
    totalBalance: TotalBalance,
    monthlyBalance: MonthlyBalance,
  ) {
    const share = await this.getShare.execute(transaction);
    if (!share) {
      return;
    }

    const earning = UpdatePortfolio.calculateEarning(share, transaction);

    share.updatePosition(
      transaction.getQuantity(),
      transaction.getTotalCost(),
      transaction.getType(),
    );

    const monthTransactions = await this.transactionRepository.getFromMonth(
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

    if (
      transaction.getTotalCost() > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX
    ) {
      monthlyBalance.setTaxWithholding(transaction.getTotalCost());
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

  async handleLiquidation(share: Share) {
    if (share.getQuantity() === 0) {
      return this.shareRepository.delete(share);
    }
    return this.updateShare.execute(share);
  }

  async getOrCreateMonthlyBalance(transaction: AbstractTransaction) {
    const monthlyBalance = await this.getMonthlyBalance.execute(transaction);
    if (!monthlyBalance) {
      return this.createMonthlyBalance.execute(transaction);
    }
    return monthlyBalance;
  }

  static calculateEarning(
    share: Share,
    transaction: AbstractTransaction,
  ): number {
    const sellCost = transaction.getTotalCost();
    const minIdealSellCost = transaction.getQuantity() * share.getMediumPrice();
    const earning = sellCost - minIdealSellCost;
    return earning;
  }

  static filterTransactionByType(transactions: AbstractTransaction[], type) {
    return transactions.filter((transaction) => transaction.type === type);
  }

  static handleEarnings(
    monthlySales: number,
    earning: number,
    monthlyBalance: MonthlyBalance,
    totalBalance: TotalBalance,
  ) {
    monthlyBalance.setTradeEarnings(
      monthlyBalance.getTradeEarnings() + earning,
    );

    // Inter bank is charging tax for all sales transactions above 20k. Which is incorrect. I am analyzing it together with the bank
    // this is the right way
    // if (monthlySales > MONTHLY_BALANCE_SALES_LIMIT) {
    //   monthlyBalance.setTaxWithholding(monthlyBalance.getTradeEarnings());
    // }

    if (
      monthlySales > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX ||
      monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.DAY_TRADE
    ) {
      UpdatePortfolio.calculateTax(monthlyBalance, totalBalance);
    }
  }

  static handleLoss(
    monthlyBalance: MonthlyBalance,
    totalBalance: TotalBalance,
    totalLoss: number,
  ) {
    monthlyBalance.setLoss(totalLoss);
    totalBalance.setLoss(totalBalance.getLoss() + totalLoss);

    if (monthlyBalance.getTax() <= 0) {
      return;
    }

    UpdatePortfolio.calculateTax(monthlyBalance, totalBalance);
  }

  static calculateTax(
    monthlyBalance: MonthlyBalance,
    totalBalance: TotalBalance,
  ) {
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

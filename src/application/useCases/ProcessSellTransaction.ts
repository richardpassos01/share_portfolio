import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateShare from './UpdateShare';
import ListTradeTransactionsFromMonth from './ListTradeTransactionsFromMonth';
import GetOrCreateMonthlyBalance from './GetOrCreateMonthlyBalance';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import {
  MONTHLY_BALANCE_SALES_LIMIT,
  MONTHLY_BALANCE_TYPE,
} from '@domain/monthlyBalance/MonthlyBalanceEnums';
import MonthlyBalance from '@domain/monthlyBalance/MonthlyBalance';
import TotalBalance from '@domain/totalBalance/TotalBalance';
import UpdateMonthlyBalance from './UpdateMonthlyBalance';
import UpdateTotalBalance from './UpdateTotalBalance';

const TAX_PERCENTAGE = {
  SWING_TRADE: 0.15,
  DAY_TRADE: 0.2,
};

@injectable()
export default class ProcessSellTransaction {
  constructor(
    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.ListTradeTransactionsFromMonth)
    private readonly listTradeTransactionsFromMonth: ListTradeTransactionsFromMonth,

    @inject(TYPES.GetOrCreateMonthlyBalance)
    private readonly getOrCreateMonthlyBalance: GetOrCreateMonthlyBalance,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,

    @inject(TYPES.UpdateShare)
    private readonly updateShare: UpdateShare,

    @inject(TYPES.UpdateMonthlyBalance)
    private readonly updateMonthlyBalance: UpdateMonthlyBalance,

    @inject(TYPES.UpdateTotalBalance)
    private readonly updateTotalBalance: UpdateTotalBalance,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const monthlyBalance =
      await this.getOrCreateMonthlyBalance.execute(transaction);
    const share = await this.getShare.execute(transaction);

    if (!share) {
      throw new Error();
    }

    const totalBalance = await this.getTotalBalance.execute(
      transaction.getInstitutionId(),
    );

    const earningOrLoss = share.getEarningsOrLoss(transaction);

    share.updatePosition(
      transaction.getQuantity(),
      transaction.getTotalCost(),
      transaction.getType(),
    );

    const [buyTransactions, sellTransactions] =
      await this.listTradeTransactionsFromMonth.execute(transaction);

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

    if (earningOrLoss < 0) {
      const totalLoss = Math.abs(earningOrLoss);
      this.handleLoss(monthlyBalance, totalBalance, totalLoss);
    }

    if (earningOrLoss > 0) {
      this.handleEarnings(
        monthlySales,
        earningOrLoss,
        monthlyBalance,
        totalBalance,
      );
    }

    await Promise.all([
      this.updateShare.execute(share),
      this.updateMonthlyBalance.execute(monthlyBalance),
      this.updateTotalBalance.execute(totalBalance),
    ]);
  }

  handleEarnings(
    monthlySales: number,
    earning: number,
    monthlyBalance: MonthlyBalance,
    totalBalance: TotalBalance,
  ) {
    monthlyBalance.setTradeEarnings(
      monthlyBalance.getTradeEarnings() + earning,
    );

    if (
      monthlySales > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX ||
      monthlyBalance.getType() === MONTHLY_BALANCE_TYPE.DAY_TRADE
    ) {
      this.calculateTax(monthlyBalance, totalBalance);
    }
  }

  handleLoss(
    monthlyBalance: MonthlyBalance,
    totalBalance: TotalBalance,
    totalLoss: number,
  ) {
    monthlyBalance.setLoss(totalLoss);
    totalBalance.setLoss(totalBalance.getLoss() + totalLoss);

    if (monthlyBalance.getTax() <= 0) {
      return;
    }

    this.calculateTax(monthlyBalance, totalBalance);
  }

  calculateTax(monthlyBalance: MonthlyBalance, totalBalance: TotalBalance) {
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

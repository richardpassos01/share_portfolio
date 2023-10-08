import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import UpdateMonthlyBalance from '@application/useCases/UpdateMonthlyBalance';
import UpdateTotalBalance from '@application/useCases/UpdateTotalBalance';
import FinancialReport from '@domain/financialReport/FinancialReport';
import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { dateToMonthYear } from '@helpers';

@injectable()
export default class UpdateBalancesFromFinancialReport {
  constructor(
    @inject(TYPES.UpdateTotalBalance)
    private readonly updateTotalBalance: UpdateTotalBalance,

    @inject(TYPES.UpdateMonthlyBalance)
    private readonly updateMonthlyBalance: UpdateMonthlyBalance,
  ) {}

  async execute(
    financialReport: FinancialReport,
    transaction: AbstractTransaction,
  ): Promise<[void, void]> {
    const totalBalance = new TotalBalance(
      transaction.institutionId,
      financialReport.totalEarnings,
      financialReport.totalLoss,
    );
    const monthlyBalance = new MonthlyBalance(
      transaction.institutionId,
      dateToMonthYear(transaction.date),
      financialReport.monthlyTradeEarnings,
      financialReport.monthlyDividendEarnings,
      financialReport.monthlyTax,
      financialReport.monthlyTaxWithholding,
      financialReport.monthlyLoss,
      financialReport.monthlyOperationType,
    );

    // return Promise.all([
    //   this.createOrUpdateTotalBalance.execute(totalBalance),
    //   this.createOrUpdateMonthlyBalance.execute(monthlyBalance),
    // ]);

    return Promise.all([
      this.updateTotalBalance.execute(totalBalance),
      this.updateMonthlyBalance.execute(monthlyBalance),
    ]);
  }
}

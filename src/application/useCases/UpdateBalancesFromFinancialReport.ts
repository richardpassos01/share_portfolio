import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import CreateOrUpdateMonthlyBalance from '@application/useCases/CreateOrUpdateMonthlyBalance';
import CreateOrUpdateTotalBalance from '@application/useCases/CreateOrUpdateTotalBalance';
import FinancialReport from '@domain/financialReport/FinancialReport';
import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { dateToMonthYear } from '@helpers';

@injectable()
export default class UpdateBalancesFromFinancialReport {
  constructor(
    @inject(TYPES.CreateOrUpdateTotalBalance)
    private readonly createOrUpdateTotalBalance: CreateOrUpdateTotalBalance,

    @inject(TYPES.CreateOrUpdateMonthlyBalance)
    private readonly createOrUpdateMonthlyBalance: CreateOrUpdateMonthlyBalance,
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

    return Promise.all([
      this.createOrUpdateTotalBalance.execute(totalBalance),
      this.createOrUpdateMonthlyBalance.execute(monthlyBalance),
    ]);
  }
}

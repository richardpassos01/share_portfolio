import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { AbstractTransaction } from '@domain/shared/interfaces';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import FinancialReport from '@domain/financialReport/FinancialReport';

@injectable()
export default class CreateFinancialReportFromBalances {
  constructor(
    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<FinancialReport> {
    const totalBalance = await this.getTotalBalance.execute(
      transaction.institutionId,
    );
    const monthlyBalance = await this.getMonthlyBalance.execute(transaction);

    const financialReport = new FinancialReport(
      totalBalance?.earnings,
      totalBalance?.loss,
      monthlyBalance?.tradeEarnings,
      monthlyBalance?.dividendEarnings,
      monthlyBalance?.tax,
      monthlyBalance?.taxWithholding,
      monthlyBalance?.loss,
      monthlyBalance?.type,
    );

    return financialReport;
  }
}

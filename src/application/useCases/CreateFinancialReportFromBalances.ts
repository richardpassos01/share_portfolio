import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import FinancialReport from '@domain/financialReport/FinancialReport';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class CreateFinancialReportFromBalances {
  constructor(
    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute({
    institutionId,
    date,
  }: TransactionDTO): Promise<FinancialReport> {
    const totalBalance = await this.getTotalBalance.execute(institutionId);
    const monthlyBalance = await this.getMonthlyBalance.execute(
      institutionId,
      date,
    );

    const financialReport = new FinancialReport(
      totalBalance?.loss,
      monthlyBalance?.tradeEarning,
      monthlyBalance?.dividendEarning,
      monthlyBalance?.tax,
      monthlyBalance?.taxWithholding,
      monthlyBalance?.loss,
      monthlyBalance?.type,
    );

    return financialReport;
  }
}

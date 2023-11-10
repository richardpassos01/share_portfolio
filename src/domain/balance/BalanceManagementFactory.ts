import { injectable, inject } from 'inversify';
import { TYPES } from '@constants/types';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import BalanceManagement from './BalanceManagement';

@injectable()
export default class BalanceManagementFactory {
  constructor(
    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async build(institutionId: string, date: Date): Promise<BalanceManagement> {
    const totalBalance = await this.getTotalBalance.execute(institutionId);
    const monthlyBalance = await this.getMonthlyBalance.execute(
      institutionId,
      date,
    );

    return new BalanceManagement(
      totalBalance?.loss,
      monthlyBalance?.tradeEarning,
      monthlyBalance?.dividendEarning,
      monthlyBalance?.tax,
      monthlyBalance?.taxWithholding,
      monthlyBalance?.loss,
      monthlyBalance?.type,
    );
  }
}

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import BalanceManagement from '@domain/portfolio/BalanceManagement';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class CreateBalanceManagement {
  constructor(
    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute({
    institutionId,
    date,
  }: TransactionDTO): Promise<BalanceManagement> {
    const totalBalance = await this.getTotalBalance.execute(institutionId);
    const monthlyBalance = await this.getMonthlyBalance.execute(
      institutionId,
      date,
    );

    const balanceManagement = new BalanceManagement(
      totalBalance?.loss,
      monthlyBalance?.tradeEarning,
      monthlyBalance?.dividendEarning,
      monthlyBalance?.tax,
      monthlyBalance?.taxWithholding,
      monthlyBalance?.loss,
      monthlyBalance?.type,
    );

    return balanceManagement;
  }
}

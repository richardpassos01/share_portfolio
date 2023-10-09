import GetTotalBalance from '@application/queries/GetTotalBalance';
import { TYPES } from '@constants/types';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';
import { injectable, inject } from 'inversify';

@injectable()
export default class CalculateTotalBalanceEarning {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute(institutionId: string): Promise<TotalBalance> {
    const { sum: monthlyEarnings } =
      await this.monthlyBalanceRepository.sumEarnings(institutionId);

    const balance = await this.getTotalBalance.execute(institutionId);

    if (!balance) {
      throw Error();
    }

    const netEarning = Math.max(0, monthlyEarnings - balance.loss);

    balance.setEarning(netEarning);
    return balance;
  }
}

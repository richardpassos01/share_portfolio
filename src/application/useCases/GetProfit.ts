import { TYPES } from '@constants/types';
import { formatterMoney } from '../../helpers';
import { injectable, inject } from 'inversify';
import GetTotalBalance from './GetTotalBalance';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

@injectable()
export default class GetProfit {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute(institutionId: string) {
    const { earnings } =
      await this.monthlyBalanceRepository.sumEarnings(institutionId);

    const balance = await this.getTotalBalance.execute(institutionId);
    const profit = Math.max(0, earnings - balance.getLoss());
    return formatterMoney(profit);
  }
}

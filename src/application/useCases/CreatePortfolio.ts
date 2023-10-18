import GetTotalBalance from '@application/queries/GetTotalBalance';
import { TYPES } from '@constants/types';
import Portfolio from '@domain/portfolio/Portfolio';
import MonthlyBalanceRepositoryInterface from '@domain/portfolio/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class CreatePortfolio {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute(institutionId: string): Promise<Portfolio> {
    const { sum: monthlyEarnings } =
      await this.monthlyBalanceRepository.sumEarnings(institutionId);

    const totalBalance = await this.getTotalBalance.execute(institutionId);

    if (!totalBalance) {
      throw Error();
    }

    const netEarning = Math.max(0, monthlyEarnings - totalBalance.loss);

    return new Portfolio(netEarning, totalBalance.loss);
  }
}

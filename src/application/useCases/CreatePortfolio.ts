import { TYPES } from '@constants/types';
import Portfolio from '@domain/portfolio/Portfolio';
import TotalBalanceRepositoryInterface from '@domain/portfolio/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { ReasonPhrases } from '@domain/shared/enums';
import NotFoundError from '@domain/shared/error/NotFoundError';
import { injectable, inject } from 'inversify';

@injectable()
export default class CreatePortfolio {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<Portfolio> {
    const totalBalance = await this.totalBalanceRepository.get(institutionId);

    if (!totalBalance) {
      throw new NotFoundError(ReasonPhrases.TOTAL_BALANCE_NOT_FOUND);
    }

    return new Portfolio(totalBalance.netEarning, totalBalance.loss);
  }
}

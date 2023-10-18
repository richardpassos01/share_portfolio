import { TYPES } from '@constants/types';
import TotalBalance from '@domain/portfolio/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/portfolio/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class CreateOrUpdateTotalBalance {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(totalBalance: TotalBalance): Promise<void> {
    return this.totalBalanceRepository.createOrUpdate(totalBalance);
  }
}

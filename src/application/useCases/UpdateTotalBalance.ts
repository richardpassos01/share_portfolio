import { TYPES } from '@constants/types';
import TotalBalance from '@domain/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class UpdateTotalBalance {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(totalBalance: TotalBalance): Promise<void> {
    return this.totalBalanceRepository.update(totalBalance);
  }
}

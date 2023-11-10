import { TYPES } from '@constants/types';
import TotalBalance from '@domain/balance/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/balance/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class GetTotalBalance {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<TotalBalance | undefined> {
    return this.totalBalanceRepository.get(institutionId);
  }
}

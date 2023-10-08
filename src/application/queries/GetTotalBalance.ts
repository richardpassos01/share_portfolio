import { TYPES } from '@constants/types';
import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/financialReport/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class GetTotalBalance {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<TotalBalance> {
    return this.totalBalanceRepository.get(institutionId);
  }
}

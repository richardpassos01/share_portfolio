import { TYPES } from '@constants/types';
import TotalBalanceRepositoryInterface from '@domain/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class GetTotalBalance {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(institutionId: string) {
    return this.totalBalanceRepository.get(institutionId);
  }
}

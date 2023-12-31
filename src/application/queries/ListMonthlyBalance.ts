import { TYPES } from '@constants/types';
import MonthlyBalanceRepositoryInterface from '@domain/balance/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';
import MonthlyBalance from '@domain/balance/monthlyBalance/MonthlyBalance';

@injectable()
export default class ListMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(
    institutionId: string,
    limit?: number,
  ): Promise<MonthlyBalance[]> {
    return this.monthlyBalanceRepository.list(institutionId, limit);
  }
}

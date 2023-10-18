import { TYPES } from '@constants/types';
import MonthlyBalanceRepositoryInterface from '@domain/portfolio/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';
import MonthlyBalance from '@domain/portfolio/monthlyBalance/MonthlyBalance';

@injectable()
export default class ListMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<MonthlyBalance[]> {
    return this.monthlyBalanceRepository.list(institutionId);
  }
}

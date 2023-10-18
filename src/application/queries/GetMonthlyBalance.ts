import { TYPES } from '@constants/types';
import MonthlyBalanceRepositoryInterface from '@domain/portfolio/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';
import MonthlyBalance from '@domain/portfolio/monthlyBalance/MonthlyBalance';
import { dateToMonthYear } from '@helpers';

@injectable()
export default class GetMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(
    institutionId: string,
    date: Date,
  ): Promise<MonthlyBalance | undefined> {
    const yearMonth = dateToMonthYear(date);

    return this.monthlyBalanceRepository.get(institutionId, yearMonth);
  }
}

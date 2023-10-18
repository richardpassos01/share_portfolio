import { TYPES } from '@constants/types';
import MonthlyBalance from '@domain/portfolio/monthlyBalance/MonthlyBalance';
import MonthlyBalanceRepositoryInterface from '@domain/portfolio/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class CreateOrUpdateMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(monthlyBalance: MonthlyBalance): Promise<void> {
    return this.monthlyBalanceRepository.createOrUpdate(monthlyBalance);
  }
}

import { TYPES } from '@constants/types';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class UpdateMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(monthlyBalance: MonthlyBalance): Promise<void> {
    return this.monthlyBalanceRepository.update(monthlyBalance);
  }
}

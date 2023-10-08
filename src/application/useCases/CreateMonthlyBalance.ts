import { injectable, inject } from 'inversify';
import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { dateToMonthYear } from '@helpers';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

@injectable()
export default class CreateMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<MonthlyBalance> {
    const yearMonth = dateToMonthYear(transaction.getDate());

    const monthlyBalance = new MonthlyBalance(
      transaction.institutionId,
      yearMonth,
    );

    await this.monthlyBalanceRepository.create(monthlyBalance);
    return monthlyBalance;
  }
}

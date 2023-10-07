import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import MonthlyBalance from '../../domain/monthlyBalance/MonthlyBalance';
import { dateToMonthYear } from '../../helpers';
import { injectable, inject } from 'inversify';
import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';

@injectable()
export default class CreateMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<MonthlyBalance> {
    const yearMonth = dateToMonthYear(transaction.getDate());

    const monthlyBalance = new MonthlyBalance(
      transaction.getInstitutionId(),
      yearMonth,
    );

    await this.monthlyBalanceRepository.create(monthlyBalance);

    return monthlyBalance;
  }
}

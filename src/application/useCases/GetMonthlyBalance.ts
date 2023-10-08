import { TYPES } from '@constants/types';
import { dateToMonthYear } from '../../helpers';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';
import { AbstractTransaction } from '@domain/shared/interfaces';
import MonthlyBalance from '@domain/monthlyBalance/MonthlyBalance';

@injectable()
export default class GetMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<MonthlyBalance> {
    const yearMonth = dateToMonthYear(transaction.getDate());

    let monthlyBalance = await this.monthlyBalanceRepository.get(
      transaction.getInstitutionId(),
      yearMonth,
    );

    if (monthlyBalance) {
      return monthlyBalance;
    }

    monthlyBalance = new MonthlyBalance(
      transaction.getInstitutionId(),
      yearMonth,
    );

    await this.monthlyBalanceRepository.create(monthlyBalance);

    return monthlyBalance;
  }
}

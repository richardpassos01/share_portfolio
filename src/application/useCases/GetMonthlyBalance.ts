import { TYPES } from '@constants/types';
import { dateToMonthYear } from '../../helpers';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { injectable, inject } from 'inversify';
import { AbstractTransaction } from '@domain/shared/interfaces';

@injectable()
export default class GetMonthlyBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction) {
    const yearMonth = dateToMonthYear(transaction.getDate());

    return this.monthlyBalanceRepository.get(
      transaction.getInstitutionId(),
      yearMonth,
    );
  }
}

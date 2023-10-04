import MonthlyBalance from '../../domain/monthlyBalance/MonthlyBalance';
import { dateToMonthYear } from '../../helpers/Helpers';

export default class CreateMonthlyBalance {
  constructor(monthlyBalanceRepository) {
    this.monthlyBalanceRepository = monthlyBalanceRepository;
  }

  async execute(institutionId, date) {
    const yearMonth = dateToMonthYear(date);

    const monthlyBalance = new MonthlyBalance({
      institutionId,
      yearMonth,
    });

    await this.monthlyBalanceRepository.create(monthlyBalance);

    return monthlyBalance;
  }
}

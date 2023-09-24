import MonthlyBalance from '../../domain/transaction/balance/MonthlyBalance.js';
import { dateToMonthYear } from '../../helpers/Helpers.js';

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

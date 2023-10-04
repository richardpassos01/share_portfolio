import { dateToMonthYear } from '../../helpers/Helpers';

export default class GetMonthlyBalance {
  constructor(monthlyBalanceRepository) {
    this.monthlyBalanceRepository = monthlyBalanceRepository;
  }

  async execute(institutionId, date) {
    const yearMonth = dateToMonthYear(date);

    return this.monthlyBalanceRepository.get(institutionId, yearMonth);
  }
}

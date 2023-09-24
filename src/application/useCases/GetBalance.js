import { dateToMonthYear } from '../../helpers/Helpers.js';

export default class GetBalance {
  constructor(balanceRepository) {
    this.balanceRepository = balanceRepository;
  }

  async execute(institutionId, date) {
    const yearMonth = dateToMonthYear(date);

    return this.balanceRepository.get(institutionId, yearMonth);
  }
}

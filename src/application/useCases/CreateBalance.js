import Balance from '../../domain/transaction/balance/Balance.js';
import { dateToMonthYear } from '../../helpers/Helpers.js';

export default class CreateBalance {
  constructor(balanceRepository) {
    this.balanceRepository = balanceRepository;
  }

  async execute(institutionId, date) {
    const yearMonth = dateToMonthYear(date);

    const balance = new Balance({
      institutionId,
      yearMonth,
    });

    await this.balanceRepository.create(balance);

    return balance;
  }
}

export default class UpdateMonthlyBalance {
  constructor(monthlyBalanceRepository) {
    this.monthlyBalanceRepository = monthlyBalanceRepository;
  }

  async execute(monthlyBalance) {
    return this.monthlyBalanceRepository.update(monthlyBalance);
  }
}

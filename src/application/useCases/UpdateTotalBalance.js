export default class UpdateTotalBalance {
  constructor(totalBalanceRepository) {
    this.totalBalanceRepository = totalBalanceRepository;
  }

  async execute(totalBalance) {
    return this.totalBalanceRepository.update(totalBalance);
  }
}

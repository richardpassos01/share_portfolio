export default class UpdateBalance {
  constructor(balanceRepository) {
    this.balanceRepository = balanceRepository;
  }

  async execute(balance) {
    return this.balanceRepository.update(balance);
  }
}

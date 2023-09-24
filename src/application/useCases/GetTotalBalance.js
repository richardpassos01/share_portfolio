export default class GetTotalBalance {
  constructor(totalBalanceRepository) {
    this.totalBalanceRepository = totalBalanceRepository;
  }

  async execute(institutionId) {
    return this.totalBalanceRepository.get(institutionId);
  }
}

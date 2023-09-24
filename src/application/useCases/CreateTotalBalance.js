import TotalBalance from '../../domain/totalBalance/TotalBalance.js';

export default class CreateTotalBalance {
  constructor(totalBalanceRepository) {
    this.totalBalanceRepository = totalBalanceRepository;
  }

  async execute(institutionId) {
    const totalBalance = new TotalBalance({
      institutionId,
    });

    await this.totalBalanceRepository.create(totalBalance);

    return totalBalance;
  }
}

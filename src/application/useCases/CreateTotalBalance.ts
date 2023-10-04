import TotalBalance from '../../domain/totalBalance/TotalBalance';

export default class CreateTotalBalance {
  constructor(totalBalanceRepository) {
    this.totalBalanceRepository = totalBalanceRepository;
  }

  async execute(institutionId) {
    const totalBalance = new TotalBalance({
      institutionId,
    });

    return this.totalBalanceRepository.create(totalBalance);
  }
}
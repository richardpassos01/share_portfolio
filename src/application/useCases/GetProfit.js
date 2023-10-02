export default class GetProfit {
  constructor(monthlyBalanceRepository, totalBalanceRepository) {
    this.monthlyBalanceRepository = monthlyBalanceRepository;
    this.totalBalanceRepository = totalBalanceRepository;
  }

  async execute(institutionId) {
    try {
      const { earnings } =
        await this.monthlyBalanceRepository.sumEarnings(institutionId);

      const balance = await this.totalBalanceRepository.get(institutionId);

      return Math.max(0, earnings - balance.getLoss());
    } catch (error) {
      return 0;
    }
  }
}

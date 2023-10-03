import { formatterMoney } from '../../helpers/Helpers.js';

export default class GetProfit {
  constructor(monthlyBalanceRepository, totalBalanceRepository) {
    this.monthlyBalanceRepository = monthlyBalanceRepository;
    this.totalBalanceRepository = totalBalanceRepository;
  }

  async execute(institutionId) {
    const { earnings } =
      await this.monthlyBalanceRepository.sumEarnings(institutionId);

    const balance = await this.totalBalanceRepository.get(institutionId);
    const profit = Math.max(0, earnings - balance.getLoss());
    return formatterMoney(profit);
  }
}

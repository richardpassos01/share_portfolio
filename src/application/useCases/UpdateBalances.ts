import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import BalanceManagement from '@domain/balance/BalanceManagement';
import TotalBalance from '@domain/balance/totalBalance/TotalBalance';
import MonthlyBalance from '@domain/balance/monthlyBalance/MonthlyBalance';
import TotalBalanceRepositoryInterface from '@domain/balance/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/balance/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

@injectable()
export default class UpdateBalances {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,

    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(
    balanceManagement: BalanceManagement,
    monthYear: string,
    institutionId: string,
  ): Promise<void> {
    const monthlyBalance = new MonthlyBalance(
      institutionId,
      monthYear,
      balanceManagement.monthlyTradeEarning,
      balanceManagement.monthlyDividendEarning,
      balanceManagement.monthlyTax,
      balanceManagement.monthlyTaxWithholding,
      balanceManagement.monthlyTaxGross,
      balanceManagement.monthlyLoss,
      balanceManagement.monthlyTotalSold,
      balanceManagement.monthlyRestitution,
      balanceManagement.monthlyCurrentTotalLoss,
      balanceManagement.monthlyOperationType,
    );
    await this.monthlyBalanceRepository.createOrUpdate(monthlyBalance);

    const { sum: monthlyEarnings } =
      await this.monthlyBalanceRepository.sumEarnings(institutionId);

    const totalBalance = new TotalBalance(
      institutionId,
      balanceManagement.totalLoss,
    );

    totalBalance.setNetEarning(monthlyEarnings);

    await this.totalBalanceRepository.createOrUpdate(totalBalance);
  }
}

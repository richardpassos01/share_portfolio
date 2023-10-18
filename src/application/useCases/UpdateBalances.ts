import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import BalanceManagement from '@domain/portfolio/BalanceManagement';
import TotalBalance from '@domain/portfolio/totalBalance/TotalBalance';
import MonthlyBalance from '@domain/portfolio/monthlyBalance/MonthlyBalance';
import { dateToMonthYear } from '@helpers';
import { TransactionDTO } from '@domain/shared/types';
import TotalBalanceRepositoryInterface from '@domain/portfolio/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/portfolio/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

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
    transaction: TransactionDTO,
  ): Promise<void> {
    const monthlyBalance = new MonthlyBalance(
      transaction.institutionId,
      dateToMonthYear(transaction.date),
      balanceManagement.monthlyTradeEarning,
      balanceManagement.monthlyDividendEarning,
      balanceManagement.monthlyTax,
      balanceManagement.monthlyTaxWithholding,
      balanceManagement.monthlyLoss,
      balanceManagement.monthlyOperationType,
    );
    await this.monthlyBalanceRepository.createOrUpdate(monthlyBalance);

    const { sum: monthlyEarnings } =
      await this.monthlyBalanceRepository.sumEarnings(
        transaction.institutionId,
      );

    const totalBalance = new TotalBalance(
      transaction.institutionId,
      balanceManagement.totalLoss,
    );

    totalBalance.setNetEarning(monthlyEarnings);

    await this.totalBalanceRepository.createOrUpdate(totalBalance);
  }
}

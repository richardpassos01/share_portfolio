import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import CreateOrUpdateMonthlyBalance from '@application/useCases/CreateOrUpdateMonthlyBalance';
import CreateOrUpdateTotalBalance from '@application/useCases/CreateOrUpdateTotalBalance';
import BalanceManagement from '@domain/portfolio/BalanceManagement';
import TotalBalance from '@domain/portfolio/totalBalance/TotalBalance';
import MonthlyBalance from '@domain/portfolio/monthlyBalance/MonthlyBalance';
import { dateToMonthYear } from '@helpers';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class UpdateBalances {
  constructor(
    @inject(TYPES.CreateOrUpdateTotalBalance)
    private readonly createOrUpdateTotalBalance: CreateOrUpdateTotalBalance,

    @inject(TYPES.CreateOrUpdateMonthlyBalance)
    private readonly createOrUpdateMonthlyBalance: CreateOrUpdateMonthlyBalance,
  ) {}

  async execute(
    balanceManagement: BalanceManagement,
    transaction: TransactionDTO,
  ): Promise<[void, void]> {
    const totalBalance = new TotalBalance(
      transaction.institutionId,
      balanceManagement.totalLoss,
    );
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

    return Promise.all([
      this.createOrUpdateTotalBalance.execute(totalBalance),
      this.createOrUpdateMonthlyBalance.execute(monthlyBalance),
    ]);
  }
}

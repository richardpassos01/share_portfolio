import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import UpdatePortfolio from './UpdatePortfolio';
import TotalBalanceRepositoryInterface from '@domain/financialReport/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import { TransactionDTO } from '@domain/shared/types';
import { isSameMonthYear } from '@helpers';

@injectable()
export default class ReSyncPortfolio {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,

    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,

    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,

    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,

    @inject(TYPES.UpdatePortfolio)
    private readonly updatePortfolio: UpdatePortfolio,
  ) {}

  async execute(institutionId: string): Promise<void> {
    await this.resetPortfolio(institutionId);
    const inititalPageSize = 1;
    const pageSize = 100;
    let page = 1;

    const initialResponse = await this.transactionRepository.list(
      institutionId,
      page,
      inititalPageSize,
    );

    while (page <= Math.ceil(initialResponse.totalItems / pageSize)) {
      const paginatedResponse = await this.transactionRepository.list(
        institutionId,
        page,
        pageSize,
      );

      await this.handleUpdatePortfolio(paginatedResponse.results);
      page++;
    }
  }

  async resetPortfolio(institutionId: string) {
    await this.totalBalanceRepository.delete(institutionId);
    await this.monthlyBalanceRepository.deleteAll(institutionId);
    await this.shareRepository.deleteAll(institutionId);
  }

  async handleUpdatePortfolio(transactions: TransactionDTO[]) {
    for (const transaction of transactions) {
      const monthlyTransactions = this.filterMonthlyTransactionsBeforeTarget(
        transaction,
        transactions,
      );
      // set on REDIS
      await this.updatePortfolio.execute(transaction, monthlyTransactions);
    }
  }

  filterMonthlyTransactionsBeforeTarget(
    targetTransaction: TransactionDTO,
    transactions: TransactionDTO[],
  ) {
    const transactionIndex = transactions.findIndex(
      (t) => t.id === targetTransaction.id,
    );

    return transactions.filter(
      (t, i) =>
        isSameMonthYear(t.date, targetTransaction.date) &&
        i <= transactionIndex,
    );
  }
}

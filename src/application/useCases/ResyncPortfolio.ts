import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import UpdatePortfolio from './UpdatePortfolio';
import TotalBalanceRepositoryInterface from '@domain/balance/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/balance/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import Transaction from '@domain/transaction/Transaction';

@injectable()
export default class ResyncPortfolio {
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

      await this.handleUpdatePortfolio(paginatedResponse.items);
      page++;
    }
  }

  async resetPortfolio(institutionId: string) {
    await this.totalBalanceRepository.delete(institutionId);
    await this.monthlyBalanceRepository.deleteAll(institutionId);
    await this.shareRepository.deleteAll(institutionId);
  }

  async handleUpdatePortfolio(transactions: Transaction[]) {
    await this.updatePortfolio.execute(transactions);
  }
}

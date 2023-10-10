import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import UpdatePortfolio from './UpdatePortfolio';

@injectable()
export default class SyncPortfolio {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,

    @inject(TYPES.UpdatePortfolio)
    private readonly updatePortfolio: UpdatePortfolio,
  ) {}

  async execute(institutionId: string): Promise<void> {
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

      await this.updatePortfolio.execute(paginatedResponse.results);

      page++;
    }
  }
}

import { TYPES } from '@constants/types';
import Pagination from '@domain/shared/Pagination';
import { SortOrder } from '@domain/shared/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class ListTransactions {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(
    institutionId: string,
    page = 1,
    limit = 100,
    order?: SortOrder,
  ): Promise<Pagination> {
    return this.transactionRepository.list(institutionId, page, limit, order);
  }
}

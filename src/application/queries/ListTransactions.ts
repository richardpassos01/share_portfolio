import { TYPES } from '@constants/types';
import Pagination from '@domain/shared/Pagination';
import Transaction from '@domain/transaction/Transaction';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class ListTransactions {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<Pagination> {
    return this.transactionRepository.list(institutionId);
  }
}

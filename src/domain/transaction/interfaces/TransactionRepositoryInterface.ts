import Pagination from '@domain/shared/Pagination';
import Transaction from '../Transaction';
import { TransactionDTO } from '@domain/shared/types';

export default interface TransactionRepositoryInterface {
  createMany(transaction: Transaction[]): Promise<void>;
  delete(institutionId: string, ids: string[]): Promise<void>;
  list(
    institutionId: string,
    page?: number,
    limit?: number,
  ): Promise<Pagination>;
  listFromMonth(transaction: TransactionDTO): Promise<Transaction[]>;
}

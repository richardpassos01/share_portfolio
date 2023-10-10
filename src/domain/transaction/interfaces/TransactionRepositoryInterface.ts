import Pagination from '@domain/shared/Pagination';
import Transaction from '../Transaction';

export default interface TransactionRepositoryInterface {
  createMany(transaction: Transaction[]): Promise<void>;
  delete(ids: string[]): Promise<void>;
  list(
    institutionId: string,
    page?: number,
    limit?: number,
  ): Promise<Pagination>;
  listFromMonth(institutionId: string, date: Date): Promise<Transaction[]>;
}

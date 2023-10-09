import Transaction from '../Transaction';

export default interface TransactionRepositoryInterface {
  createMany(transaction: Transaction[]): Promise<void>;
  delete(ids: string[]): Promise<void>;
  list(institutionId: string): Promise<Transaction[]>;
  listFromMonth(institutionId: string, date: Date): Promise<Transaction[]>;
}

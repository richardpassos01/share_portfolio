import Transaction from '../Transaction';

export default interface TransactionRepositoryInterface {
  create(transaction: Transaction): Promise<void>;
  delete(ids: string[]): Promise<void>;
  list(institutionId: string): Promise<Transaction[]>;
  listFromMonth(institutionId: string, date: Date): Promise<Transaction[]>;
}

import Transaction from '../Transaction';

export default interface TransactionRepositoryInterface {
  create(transaction: Transaction): Promise<void>;
  getFromMonth(institutionId: string, date: Date): Promise<Transaction[]>;
  list(institutionId: string): Promise<Transaction[]>;
}

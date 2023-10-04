import Transaction from '../Transaction';

export default interface TransactionRepositoryInterface {
  get(institutionId: string): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<void>;
  getFromMonth(institutionId: string, date: Date): Promise<Transaction[]>;
}

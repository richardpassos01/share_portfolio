import MonthlyBalance from '../MonthlyBalance';

export default interface MonthlyBalanceRepositoryInterface {
  get(institutionId: string, yearMonth: string): Promise<MonthlyBalance | null>;
  create(balance: MonthlyBalance): Promise<void>;
  update(balance: MonthlyBalance): Promise<void>;
  sumEarnings(institutionId: string): Promise<number>;
}
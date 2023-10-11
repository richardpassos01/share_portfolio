import MonthlyBalance from '../MonthlyBalance';

export default interface MonthlyBalanceRepositoryInterface {
  get(
    institutionId: string,
    yearMonth: string,
  ): Promise<MonthlyBalance | undefined>;
  list(institutionId: string): Promise<MonthlyBalance[]>;
  deleteAll(institutionId: string): Promise<void>;
  createOrUpdate(balance: MonthlyBalance): Promise<void>;
  sumEarnings(institutionId: string): Promise<{ sum: number }>;
}

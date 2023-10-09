import MonthlyBalance from '../MonthlyBalance';

export default interface MonthlyBalanceRepositoryInterface {
  get(
    institutionId: string,
    yearMonth: string,
  ): Promise<MonthlyBalance | undefined>;
  createOrUpdate(balance: MonthlyBalance): Promise<void>;
  sumEarnings(institutionId: string): Promise<{ sum: number }>;
}

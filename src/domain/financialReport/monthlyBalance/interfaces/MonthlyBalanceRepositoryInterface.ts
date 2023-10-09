import MonthlyBalance from '../MonthlyBalance';

export default interface MonthlyBalanceRepositoryInterface {
  get(
    institutionId: string,
    yearMonth: string,
  ): Promise<MonthlyBalance | undefined>;
  createOrUpdate(balance: MonthlyBalance): Promise<void>;
  sumEarning(institutionId: string): Promise<Record<string, number>>;
}

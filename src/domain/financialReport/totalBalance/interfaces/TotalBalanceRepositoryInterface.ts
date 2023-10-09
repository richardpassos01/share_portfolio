import TotalBalance from '../TotalBalance';

export default interface TotalBalanceRepositoryInterface {
  get(institutionId: string): Promise<TotalBalance | undefined>;
  createOrUpdate(balance: TotalBalance): Promise<void>;
}

import TotalBalance from '../TotalBalance';

export default interface TotalBalanceRepositoryInterface {
  get(institutionId: string): Promise<TotalBalance | undefined>;
  delete(institutionId: string): Promise<void>;
  createOrUpdate(balance: TotalBalance): Promise<void>;
}

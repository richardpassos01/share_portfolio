import TotalBalance from '../TotalBalance';

export default interface TotalBalanceRepositoryInterface {
  get(institutionId: string): Promise<TotalBalance>;
  create(balance: TotalBalance): Promise<void>;
  update(balance: TotalBalance): Promise<void>;
}

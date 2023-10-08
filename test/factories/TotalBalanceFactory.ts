import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/financialReport/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import institution from '@fixtures/institution';

type Params = {
  id?: string;
  institutionId?: string;
  loss?: number;
};

export default class TotalBalanceFactory {
  private totalBalance: TotalBalance;

  constructor(
    { id, institutionId = institution.id, loss } = {} as Params,
    totalBalance?: TotalBalance,
  ) {
    this.totalBalance =
      totalBalance || new TotalBalance(institutionId, 0, loss, id);
  }

  get() {
    return this.totalBalance;
  }

  getObject() {
    return {
      institutionId: this.totalBalance.institutionId,
      loss: this.totalBalance.loss,
    };
  }

  async save() {
    const totalBalanceRepository =
      container.get<TotalBalanceRepositoryInterface>(
        TYPES.TotalBalanceRepository,
      );
    return totalBalanceRepository.create(this.totalBalance);
  }
}

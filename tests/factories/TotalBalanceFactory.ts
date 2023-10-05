import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import TotalBalance from '@domain/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/totalBalance/interfaces/TotalBalanceRepositoryInterface';

type Params = {
  id?: string;
  institutionId?: string;
  loss?: number;
}

export default class TotalBalanceFactory {
  private totalBalance: TotalBalance;

  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    loss,
  } = {} as Params,
  totalBalance?: TotalBalance
  ) {
    this.totalBalance = totalBalance || new TotalBalance(
      institutionId,
      loss,
      id,
    );
  }

  get() {
    return this.totalBalance;
  }

  getObject() {
    return {
      institutionId: this.totalBalance.getInstitutionId(),
      loss: this.totalBalance.getLoss(),
    };
  }

  async save() {
    const totalBalanceRepository = container.get<TotalBalanceRepositoryInterface>(TYPES.TotalBalanceRepository);
    return totalBalanceRepository.create(this.totalBalance);
  }
}

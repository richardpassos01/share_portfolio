import TotalBalance from '../../src/domain/totalBalance/TotalBalance';
import { totalBalanceRepository } from '../../src/DependencyInjectionContainer';

export default class TotalBalanceFactory {
  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    loss,
  } = {}) {
    this.totalBalance = new TotalBalance({
      id,
      institutionId,
      loss,
    });
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
    return totalBalanceRepository.create(this.totalBalance);
  }
}

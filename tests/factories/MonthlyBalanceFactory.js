import MonthlyBalance from '../../src/domain/monthlyBalance/MonthlyBalance.js';
import { monthlyBalanceRepository } from '../../src/DependencyInjectionContainer';
import { dateToMonthYear } from '../../src/helpers/Helpers.js';

export default class MonthlyBalanceFactory {
  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    yearMonth = dateToMonthYear(new Date()),
    grossWins,
    loss,
    taxes,
    type,
    netWins,
  } = {}) {
    this.monthlyBalance = new MonthlyBalance({
      id,
      institutionId,
      yearMonth,
      grossWins,
      loss,
      taxes,
      type,
      netWins,
    });
  }

  get() {
    return this.monthlyBalance;
  }

  getObject() {
    return {
      institutionId: this.monthlyBalance.getInstitutionId(),
      yearMonth: this.monthlyBalance.getYearMonth(),
      grossWins: this.monthlyBalance.getGrossWins(),
      loss: this.monthlyBalance.getLoss(),
      taxes: this.monthlyBalance.getTaxes(),
      type: this.monthlyBalance.getType(),
      netWins: this.monthlyBalance.getNetWins(),
    };
  }

  async save() {
    return monthlyBalanceRepository.create(this.monthlyBalance);
  }
}

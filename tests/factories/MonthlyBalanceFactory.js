import MonthlyBalance from '../../src/domain/monthlyBalance/MonthlyBalance.js';
import { monthlyBalanceRepository } from '../../src/DependencyInjectionContainer';
import { dateToMonthYear } from '../../src/helpers/Helpers.js';

export default class MonthlyBalanceFactory {
  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    yearMonth = dateToMonthYear(new Date()),
    tradeEarnings,
    dividendEarnings,
    tax,
    taxWithholding,
    loss,
    type,
  } = {}) {
    this.monthlyBalance = new MonthlyBalance({
      id,
      institutionId,
      yearMonth,
      tradeEarnings,
      dividendEarnings,
      tax,
      taxWithholding,
      loss,
      type,
    });
  }

  get() {
    return this.monthlyBalance;
  }

  getObject() {
    return {
      institutionId: this.monthlyBalance.getInstitutionId(),
      yearMonth: this.monthlyBalance.getYearMonth(),
      tradeEarnings: this.monthlyBalance.getTradeEarnings(),
      dividendEarnings: this.monthlyBalance.getDividendEarnings(),
      tax: this.monthlyBalance.getTax(),
      taxWithholding: this.monthlyBalance.getTaxWithholding(),
      loss: this.monthlyBalance.getLoss(),
      type: this.monthlyBalance.getType(),
    };
  }

  async save() {
    return monthlyBalanceRepository.create(this.monthlyBalance);
  }
}

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import { MONTHLY_BALANCE_TYPE } from '@domain/financialReport/monthlyBalance/MonthlyBalanceEnums';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { dateToMonthYear } from '@helpers';
import institution from '@fixtures/institution';

type Params = {
  institutionId?: string;
  yearMonth?: string;
  tradeEarning?: number;
  dividendEarning?: number;
  tax?: number;
  taxWithholding?: number;
  loss?: number;
  type?: MONTHLY_BALANCE_TYPE;
};

export default class MonthlyBalanceFactory {
  private monthlyBalance: MonthlyBalance;

  constructor(
    {
      institutionId = institution.id,
      yearMonth = dateToMonthYear(new Date()),
      tradeEarning,
      dividendEarning,
      tax,
      taxWithholding,
      loss,
      type,
    } = {} as Params,
    monthlyBalance?: MonthlyBalance,
  ) {
    this.monthlyBalance =
      monthlyBalance ||
      new MonthlyBalance(
        institutionId,
        yearMonth,
        tradeEarning,
        dividendEarning,
        tax,
        taxWithholding,
        loss,
        type,
      );
  }

  get() {
    return this.monthlyBalance;
  }

  getObject() {
    return {
      institutionId: this.monthlyBalance.institutionId,
      yearMonth: this.monthlyBalance.yearMonth,
      tradeEarning: this.monthlyBalance.tradeEarning,
      dividendEarning: this.monthlyBalance.dividendEarning,
      tax: this.monthlyBalance.tax,
      taxWithholding: this.monthlyBalance.taxWithholding,
      loss: this.monthlyBalance.loss,
      type: this.monthlyBalance.type,
    };
  }

  async save() {
    const monthlyBalanceRepository =
      container.get<MonthlyBalanceRepositoryInterface>(
        TYPES.MonthlyBalanceRepository,
      );
    return monthlyBalanceRepository.createOrUpdate(this.monthlyBalance);
  }
}

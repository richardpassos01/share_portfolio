import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import { MONTHLY_BALANCE_TYPE } from '@domain/financialReport/monthlyBalance/MonthlyBalanceEnums';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { dateToMonthYear } from '@helpers';
import institution from '@fixtures/institution';

type Params = {
  id?: string;
  institutionId?: string;
  yearMonth?: string;
  tradeEarnings?: number;
  dividendEarnings?: number;
  tax?: number;
  taxWithholding?: number;
  loss?: number;
  type?: MONTHLY_BALANCE_TYPE;
};

export default class MonthlyBalanceFactory {
  private monthlyBalance: MonthlyBalance;

  constructor(
    {
      id,
      institutionId = institution.id,
      yearMonth = dateToMonthYear(new Date()),
      tradeEarnings,
      dividendEarnings,
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
        tradeEarnings,
        dividendEarnings,
        tax,
        taxWithholding,
        loss,
        type,
        id,
      );
  }

  get() {
    return this.monthlyBalance;
  }

  getObject() {
    return {
      institutionId: this.monthlyBalance.institutionId,
      yearMonth: this.monthlyBalance.yearMonth,
      tradeEarnings: this.monthlyBalance.tradeEarnings,
      dividendEarnings: this.monthlyBalance.dividendEarnings,
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
    return monthlyBalanceRepository.create(this.monthlyBalance);
  }
}

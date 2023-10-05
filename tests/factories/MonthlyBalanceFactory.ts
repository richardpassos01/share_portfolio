import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import MonthlyBalance from '@domain/monthlyBalance/MonthlyBalance';
import { MONTHLY_BALANCE_TYPE } from '@domain/monthlyBalance/MonthlyBalanceEnums';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import { dateToMonthYear } from '@helpers/Helpers';

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
} 

export default class MonthlyBalanceFactory {
  private monthlyBalance: MonthlyBalance;

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
  } = {} as Params,
  monthlyBalance?: MonthlyBalance
  ) {
    this.monthlyBalance = monthlyBalance || new MonthlyBalance(
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
    const monthlyBalanceRepository = container.get<MonthlyBalanceRepositoryInterface>(TYPES.MonthlyBalanceRepository);
    return monthlyBalanceRepository.create(this.monthlyBalance);
  }
}

import { v4 as uuid } from 'uuid';

import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums';

export default class MonthlyBalance {
  constructor(
    public readonly institutionId: string,
    public readonly yearMonth: string,
    public tradeEarnings = 0,
    public dividendEarnings = 0,
    public tax = 0,
    public taxWithholding = 0,
    public loss = 0,
    public type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  ) {}

  setTradeEarnings(value: number) {
    this.tradeEarnings = value;
  }

  setDividendEarnings(value: number) {
    this.dividendEarnings = value;
  }

  setTax(value: number) {
    this.tax = value;
  }

  setTaxWithholding(value: number) {
    this.taxWithholding = value;
  }

  setLoss(value: number) {
    this.loss = value;
  }

  setType(value: MONTHLY_BALANCE_TYPE) {
    this.type = value;
  }
}

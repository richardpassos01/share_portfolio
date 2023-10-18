import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums';

export default class MonthlyBalance {
  constructor(
    public readonly institutionId: string,
    public readonly yearMonth: string,
    public tradeEarning = 0,
    public dividendEarning = 0,
    public tax = 0,
    public taxWithholding = 0,
    public loss = 0,
    public type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  ) {}

  setTradeEarning(value: number) {
    this.tradeEarning = value;
  }

  setDividendEarning(value: number) {
    this.dividendEarning = value;
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

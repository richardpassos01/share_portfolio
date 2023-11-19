import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums';

export default class MonthlyBalance {
  constructor(
    public readonly institutionId: string,
    public readonly yearMonth: string,
    public tradeEarning = 0,
    public dividendEarning = 0,
    public tax = 0,
    public taxWithholding = 0,
    public taxGross = 0,
    public loss = 0,
    public totalSold = 0,
    public restitution = 0,
    public currentTotalLoss = 0,
    public type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  ) {}
}

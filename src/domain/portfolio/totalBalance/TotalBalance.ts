export default class TotalBalance {
  constructor(
    public readonly institutionId: string,
    public loss = 0,
    public netEarning = 0,
  ) {}

  setLoss(loss: number) {
    this.loss = loss;
  }

  setNetEarning(monthlyEarnings: number) {
    const netEarning = Math.max(0, monthlyEarnings - this.loss);
    this.netEarning = netEarning;
  }
}

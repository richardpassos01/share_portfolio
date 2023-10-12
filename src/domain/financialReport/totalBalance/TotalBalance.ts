export default class TotalBalance {
  public earning = 0;

  constructor(
    public readonly institutionId: string,
    public loss: number = 0,
  ) {}

  setLoss(loss: number) {
    this.loss = loss;
  }

  setEarning(earning: number) {
    this.earning = earning;
  }
}

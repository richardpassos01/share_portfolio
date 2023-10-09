export default class TotalBalance {
  constructor(
    public readonly institutionId: string,
    public earning: number = 0,
    public loss: number = 0,
  ) {}

  setLoss(loss: number) {
    this.loss = loss;
  }
}

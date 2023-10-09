import { v4 as uuid } from 'uuid';

export default class TotalBalance {
  constructor(
    public readonly institutionId: string,
    public earnings: number = 0,
    public loss: number = 0,
  ) {}

  setLoss(loss: number) {
    this.loss = loss;
  }
}

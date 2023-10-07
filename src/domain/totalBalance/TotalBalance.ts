import { v4 as uuid } from 'uuid';

export default class TotalBalance {
  constructor(
    private readonly institutionId: string,
    private loss: number = 0,
    private readonly id: string = uuid(),
  ) {}

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getLoss() {
    return this.loss;
  }

  setLoss(loss: number) {
    this.loss = loss;
  }
}

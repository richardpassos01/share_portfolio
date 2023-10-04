import { uuid } from 'uuidv4';

export default class TotalBalance {
  constructor(
    private readonly id: string = uuid(),
    private readonly institutionId: string,
    private loss: number = 0,
  ) { }

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

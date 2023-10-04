import { uuid } from 'uuidv4';

export default class TotalBalance {
  constructor({ id = uuid(), institutionId, loss = 0 }) {
    this.id = id;
    this.institutionId = institutionId;
    this.loss = loss;
  }

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getLoss() {
    return this.loss;
  }

  setLoss(loss) {
    this.loss = loss;
  }
}

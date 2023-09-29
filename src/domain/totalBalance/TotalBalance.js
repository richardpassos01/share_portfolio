import { uuid } from 'uuidv4';

export default class TotalBalance {
  constructor({ id = uuid(), institutionId, wins = 0, loss = 0 }) {
    this.id = id;
    this.institutionId = institutionId;
    this.wins = wins;
    this.loss = loss;
  }

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getWins() {
    return this.wins;
  }

  getLoss() {
    return this.loss;
  }

  setWins(wins) {
    this.wins = wins < 0 ? 0 : wins;
  }

  setLoss(loss) {
    this.loss = loss;
  }
}

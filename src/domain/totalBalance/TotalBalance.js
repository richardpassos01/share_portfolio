import { v4 as uuid } from 'uuid';

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

  getWins() {
    return this.wins;
  }

  getLoss() {
    return this.loss;
  }

  setWins(wins) {
    this.wins += wins;
  }

  setLoss(loss) {
    this.loss += loss;
  }
}

import { uuid } from 'uuidv4';

export default class TotalBalance {
  constructor({ id = uuid(), institutionId, wins = 0, loss = 0 }) {
    this.id = id;
    this.institutionId = institutionId;
    this.wins = wins;
    this.loss = loss;
  }

  getWins() {
    return this.wins;
  }

  setWins(wins) {
    this.wins += wins;
  }

  getLoss() {
    return this.loss;
  }

  setLoss(loss) {
    this.loss += loss;
  }
}

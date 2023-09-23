export default class Institution {
  constructor({ id, name, userId, totalLoss, totalWins }) {
    Object.assign(this, { id, name, userId, totalLoss, totalWins });
  }
}

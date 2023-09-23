export default class Balance {
  constructor({ yearMonth, totalWin = 0, totalLoss = 0, totalTaxes = 0 }) {
    Object.assign(this, {
      yearMonth,
      totalWin,
      totalLoss,
      totalTaxes,
    });
  }
}

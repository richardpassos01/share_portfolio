import { uuid } from 'uuidv4';

import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums.js';
import { dateToString } from '../../helpers/Helpers.js';

export default class MonthlyBalance {
  constructor({
    id = uuid(),
    institutionId,
    yearMonth,
    grossWins = 0,
    loss = 0,
    taxes = 0,
    netWins = 0,
    type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.yearMonth = yearMonth;
    this.grossWins = grossWins;
    this.loss = loss;
    this.taxes = taxes;
    this.netWins = netWins;
    this.type = type;
  }

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getYearMonth() {
    return this.yearMonth;
  }

  getGrossWins() {
    return this.grossWins;
  }

  getLoss() {
    return this.loss;
  }

  getType() {
    return this.type;
  }

  getTaxes() {
    return this.taxes;
  }

  getNetWins() {
    return this.netWins;
  }

  setLoss(loss) {
    this.loss = loss;
  }

  setGrossWins(wins) {
    this.grossWins = Math.max(0, wins);
  }

  setNetWins(wins) {
    this.netWins = Math.max(0, wins);
  }

  setType(buyTransactions, sellTransactions) {
    const isMatch = (sellTransaction, buyTransaction) => {
      const sameTicket =
        sellTransaction.getTicketSymbol() === buyTransaction.getTicketSymbol();
      const sameDate =
        dateToString(sellTransaction.getDate()) ===
        dateToString(buyTransaction.getDate());

      return sameTicket && sameDate;
    };

    const isDayTrade = buyTransactions.find((buyTransaction) =>
      sellTransactions.find((sellTransaction) =>
        isMatch(sellTransaction, buyTransaction),
      ),
    );

    this.type = isDayTrade
      ? MONTHLY_BALANCE_TYPE.DAY_TRADE
      : MONTHLY_BALANCE_TYPE.SWING_TRADE;
  }

  setTaxes(tax) {
    this.taxes = tax;
  }
}

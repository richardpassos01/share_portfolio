import { uuid } from 'uuidv4';

import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums.js';
import { dateToString } from '../../helpers/Helpers.js';

export default class MonthlyBalance {
  constructor({
    id = uuid(),
    institutionId,
    yearMonth,
    tradeEarnings = 0,
    dividendEarnings = 0,
    loss = 0,
    taxes = 0,
    netWins = 0,
    type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.yearMonth = yearMonth;
    this.tradeEarnings = tradeEarnings;
    this.dividendEarnings = dividendEarnings;
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

  getTradeEarnings() {
    return this.tradeEarnings;
  }

  getDividendEarnings() {
    return this.dividendEarnings;
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

  setTradeEarnings(earning) {
    this.tradeEarnings = Math.max(0, earning);
  }

  setDividendEarnings(earning) {
    this.dividendEarnings += earning;
  }

  setNetWins() {
    const netWins = Math.max(
      0,
      this.tradeEarnings + this.dividendEarnings - this.loss - this.taxes,
    );
    this.netWins = netWins;
  }

  setType(buyTransactions, sellTransactions) {
    if (this.type === MONTHLY_BALANCE_TYPE.DAY_TRADE) {
      return;
    }

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

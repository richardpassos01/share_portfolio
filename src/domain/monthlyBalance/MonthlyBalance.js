import { uuid } from 'uuidv4';

import {
  MONTHLY_BALANCE_TYPE,
  MONTHLY_SALES_LIMIT,
} from './MonthlyBalanceEnums.js';
import { dateToString } from '../../helpers/Helpers.js';

const TAX_PERCENTAGE = {
  SWING_TRADE: 0.00005,
  DAY_TRADE: 0.01,
};

export default class MonthlyBalance {
  constructor({
    id = uuid(),
    institutionId,
    yearMonth,
    tradeEarnings = 0,
    dividendEarnings = 0,
    tax = 0,
    taxWithholding = 0,
    loss = 0,
    type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.yearMonth = yearMonth;
    this.tradeEarnings = tradeEarnings;
    this.dividendEarnings = dividendEarnings;
    this.tax = tax;
    this.taxWithholding = taxWithholding;
    this.loss = loss;
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

  getType() {
    return this.type;
  }

  getTax() {
    return this.tax;
  }

  getLoss() {
    return this.loss;
  }

  getTaxWithholding() {
    return this.taxWithholding;
  }

  setTradeEarnings(earning) {
    this.tradeEarnings = Math.max(0, earning);
  }

  setDividendEarnings(earning) {
    this.dividendEarnings += earning;
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

  setTax(tax) {
    this.tax = tax;
  }

  setTaxWithholding(monthlySales) {
    if (monthlySales < MONTHLY_SALES_LIMIT) {
      return;
    }

    const taxWithholding = monthlySales * TAX_PERCENTAGE[this.type];

    this.taxWithholding += taxWithholding;
  }

  setLoss(loss) {
    this.loss += loss;
  }
}

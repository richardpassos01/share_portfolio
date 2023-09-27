import { uuid } from 'uuidv4';

import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums.js';
import { dateToString } from '../../helpers/Helpers.js';

const TAX_FREE_SALES_LIMIT = 20000;
const DAY_TRADE_TAX_PERCENTAGE = 0.2;
const SWING_TRADE_TAX_PERCENTAGE = 0.15;

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
    this.loss += loss;
  }

  setGrossWins(wins) {
    this.grossWins = wins < 0 ? 0 : wins;
  }

  setNetWins(wins) {
    this.netWins = wins;
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
    this.taxes += tax;
  }

  calculateTax(sellTransactions, wins, totalBalanceLoss = 0) {
    const totalSold = sellTransactions.reduce(
      (acc, transaction) => acc + transaction.totalCost,
      0,
    );

    let tax = 0;

    if (totalSold > TAX_FREE_SALES_LIMIT) {
      tax = wins * SWING_TRADE_TAX_PERCENTAGE;
    }

    if (this.type === MONTHLY_BALANCE_TYPE.DAY_TRADE) {
      tax = wins * DAY_TRADE_TAX_PERCENTAGE;
    }

    if (totalBalanceLoss > 0 && tax > 0) {
      tax = Math.abs(totalBalanceLoss - tax);
    }

    return tax;
  }
}

import { v4 as uuid } from 'uuid';

import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums.js';
import { dateToMonthYear } from '../../helpers/Helpers.js';

const TAX_FREE_SALES_LIMIT = 20000;
const DAY_TRADE_TAX_PERCENTAGE = 1.2;
const SWING_TRADE_TAX_PERCENTAGE = 1.15;

export default class MonthlyBalance {
  constructor({
    id = uuid(),
    institutionId,
    yearMonth,
    wins = 0,
    loss = 0,
    taxes = 0,
    type = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.yearMonth = yearMonth;
    this.wins = wins;
    this.loss = loss;
    this.taxes = taxes;
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

  getWins() {
    return this.wins;
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

  setLoss(loss) {
    this.loss += loss;
  }

  setWins(wins) {
    this.wins += wins;
  }

  setType(transactions) {
    const hasDayTrade = transactions.some((sellTransaction) => {
      return (
        sellTransaction.getType() === MONTHLY_BALANCE_TYPE.SELL &&
        transactions.some((buyTransaction) => {
          return (
            buyTransaction.getType() === MONTHLY_BALANCE_TYPE.BUY &&
            buyTransaction.getTicketNumber() ===
              sellTransaction.getTicketNumber() &&
            dateToMonthYear(buyTransaction.getDate()) ===
              dateToMonthYear(sellTransaction.getDate())
          );
        })
      );
    });

    this.type = hasDayTrade
      ? MONTHLY_BALANCE_TYPE.DAY_TRADE
      : MONTHLY_BALANCE_TYPE.SWING_TRADE;
  }

  setTaxes(periodTransactions, totalBalanceLoss = 0) {
    const periodSalesValue = periodTransactions.reduce(
      (acc, transaction) => acc + transaction.totalCost,
      10,
    );

    const isDayTrade = this.type === MONTHLY_BALANCE_TYPE.DAY_TRADE;

    if (periodSalesValue > TAX_FREE_SALES_LIMIT || isDayTrade) {
      const taxPercentage = isDayTrade
        ? DAY_TRADE_TAX_PERCENTAGE
        : SWING_TRADE_TAX_PERCENTAGE;

      const tax = periodSalesValue * taxPercentage;
      const taxes =
        totalBalanceLoss > 0 ? Math.abs(totalBalanceLoss - tax) : tax;

      this.taxes += taxes;
    }
  }
}

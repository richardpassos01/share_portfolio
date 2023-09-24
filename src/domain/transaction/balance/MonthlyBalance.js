import { uuid } from 'uuidv4';

import { MONTHLY_BALANCE_TYPE } from './MonthlyBalanceEnums.js';
import { TRANSACTION_TYPE } from '../TransactionEnums.js';
import { dateToMonthYear } from '../../../helpers/Helpers.js';

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

  setLoss(loss) {
    this.loss = loss;
  }

  setWins(wins) {
    this.wins = wins;
  }

  setType(transactions) {
    const hasDayTrade = transactions.some((sellTransaction) => {
      return (
        sellTransaction.type === TRANSACTION_TYPE.SELL &&
        transactions.some((buyTransaction) => {
          return (
            buyTransaction.type === TRANSACTION_TYPE.BUY &&
            buyTransaction.ticketNumber === sellTransaction.ticketNumber &&
            dateToMonthYear(buyTransaction.date) ===
              dateToMonthYear(sellTransaction.date)
          );
        })
      );
    });

    this.type = hasDayTrade
      ? MONTHLY_BALANCE_TYPE.DAY_TRADE
      : MONTHLY_BALANCE_TYPE.SWING_TRADE;
  }

  calculateTaxes(periodTransactions, totalBalanceLoss = 0) {
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

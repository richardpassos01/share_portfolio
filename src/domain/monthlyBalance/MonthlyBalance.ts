import { uuid } from 'uuidv4';

import {
  MONTHLY_BALANCE_TYPE,
  MONTHLY_BALANCE_SALES_LIMIT,
} from './MonthlyBalanceEnums';
import { dateToString } from '../../helpers/Helpers';
import { AbstractTransaction } from '@domain/shared/interfaces';


const TAX_PERCENTAGE: Record<MONTHLY_BALANCE_TYPE, number> = {
  [MONTHLY_BALANCE_TYPE.SWING_TRADE]: 0.00005,
  [MONTHLY_BALANCE_TYPE.DAY_TRADE]: 0.01,
};

export default class MonthlyBalance {
  constructor(
    private readonly id: string = uuid(),
    private readonly institutionId: string,
    private readonly yearMonth: string,
    private tradeEarnings = 0,
    private dividendEarnings = 0,
    private tax = 0,
    private taxWithholding = 0,
    private loss = 0,
    private type = MONTHLY_BALANCE_TYPE.SWING_TRADE
  ) {}

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

  setTradeEarnings(earning: number) {
    this.tradeEarnings = Math.max(0, earning);
  }

  setDividendEarnings(earning: number) {
    this.dividendEarnings += earning;
  }

  setType(buyTransactions: AbstractTransaction[], sellTransactions: AbstractTransaction[]) {
    if (this.type === MONTHLY_BALANCE_TYPE.DAY_TRADE) {
      return;
    }

    const isMatch = (sellTransaction: AbstractTransaction, buyTransaction: AbstractTransaction) => {
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

  setTax(tax: number) {
    this.tax = tax;
  }

  setTaxWithholding(monthlySales: number) {
    if (monthlySales < MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX) {
      return;
    }

    const taxWithholding = monthlySales * TAX_PERCENTAGE[this.type];

    this.taxWithholding += taxWithholding;
  }

  setLoss(loss: number) {
    this.loss += loss;
  }
}

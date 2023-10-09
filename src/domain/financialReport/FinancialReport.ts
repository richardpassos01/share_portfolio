import { AbstractTransaction } from '@domain/shared/interfaces';
import {
  MONTHLY_BALANCE_SALES_LIMIT,
  MONTHLY_BALANCE_TYPE,
} from './monthlyBalance/MonthlyBalanceEnums';
import { dateToString } from '@helpers';

const TAX_PERCENTAGE: Record<MONTHLY_BALANCE_TYPE, number> = {
  [MONTHLY_BALANCE_TYPE.SWING_TRADE]: 0.15,
  [MONTHLY_BALANCE_TYPE.DAY_TRADE]: 0.2,
};

const TAX_WITHHOLDING_PERCENTAGE: Record<MONTHLY_BALANCE_TYPE, number> = {
  [MONTHLY_BALANCE_TYPE.SWING_TRADE]: 0.00005,
  [MONTHLY_BALANCE_TYPE.DAY_TRADE]: 0.01,
};

export default class FinancialReport {
  constructor(
    public totalEarning = 0,
    public totalLoss = 0,
    public monthlyTradeEarning = 0,
    public monthlyDividendEarning = 0,
    public monthlyTax = 0,
    public monthlyTaxWithholding = 0,
    public monthlyLoss = 0,
    public monthlyOperationType = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  ) {}

  setTradeEarning(earning: number) {
    this.monthlyTradeEarning += Math.max(0, earning);
  }

  setDividendEarning(earning: number) {
    this.monthlyDividendEarning += earning;
  }

  setType(
    buyTransactions: AbstractTransaction[],
    sellTransactions: AbstractTransaction[],
  ) {
    const alreadyDidDayTradeAtMonth =
      this.monthlyOperationType === MONTHLY_BALANCE_TYPE.DAY_TRADE;

    if (alreadyDidDayTradeAtMonth) {
      return;
    }

    const didDayTrade = this.checkIfDidDayTradeAtMonth(
      buyTransactions,
      sellTransactions,
    );

    this.monthlyOperationType = didDayTrade
      ? MONTHLY_BALANCE_TYPE.DAY_TRADE
      : MONTHLY_BALANCE_TYPE.SWING_TRADE;
  }

  setTax(tax: number) {
    this.monthlyTax = tax;
  }

  setTaxWithholding(monthlySales: number, transactionTotalCost: number) {
    if (monthlySales < MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX) {
      return;
    }

    const taxWithholding =
      transactionTotalCost *
      TAX_WITHHOLDING_PERCENTAGE[this.monthlyOperationType];

    this.monthlyTaxWithholding += taxWithholding;
  }

  setFinancialLosses(loss: number) {
    this.monthlyLoss += loss;
    this.totalLoss += loss;
  }

  updateTotalLoss(loss: number) {
    this.totalLoss = loss;
  }

  setTotalEarning() {
    const monthlyEarning =
      this.monthlyTradeEarning +
      +this.monthlyDividendEarning -
      this.monthlyTax -
      this.monthlyTaxWithholding;

    const totalEarning = monthlyEarning + this.totalEarning - this.totalLoss;
    this.totalEarning = Math.max(0, totalEarning);
  }

  checkIfDidDayTradeAtMonth(
    sellTransactions: AbstractTransaction[],
    buyTransactions: AbstractTransaction[],
  ) {
    return buyTransactions.find(({ ticketSymbol: buyTicket, date: BuyDate }) =>
      sellTransactions.find(({ ticketSymbol: sellTicket, date: sellDate }) => {
        const sameShare = buyTicket === sellTicket;
        const tradeInSameDay = dateToString(BuyDate) === dateToString(sellDate);

        return sameShare && tradeInSameDay;
      }),
    );
  }

  calculateTax() {
    const tradetEarning = this.monthlyTradeEarning;

    let tax =
      tradetEarning * TAX_PERCENTAGE[this.monthlyOperationType] -
      this.monthlyTaxWithholding;

    if (this.totalLoss > 0 && tax > 0) {
      const taxDeductedFromLoss = tax - this.totalLoss;

      const isRemainingTotalLoss = taxDeductedFromLoss < 0;

      if (isRemainingTotalLoss) {
        tax = 0;
        this.updateTotalLoss(Math.abs(taxDeductedFromLoss));
      } else {
        tax = taxDeductedFromLoss;
        this.updateTotalLoss(0);
      }
    }

    this.setTax(tax);
  }
}

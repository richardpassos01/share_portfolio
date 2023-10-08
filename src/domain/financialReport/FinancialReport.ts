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
    public totalEarnings = 0,
    public totalLoss = 0,
    public monthlyTradeEarnings = 0,
    public monthlyDividendEarnings = 0,
    public monthlyTax = 0,
    public monthlyTaxWithholding = 0,
    public monthlyLoss = 0,
    public monthlyOperationType = MONTHLY_BALANCE_TYPE.SWING_TRADE,
  ) {}

  setTradeEarnings(earning: number) {
    this.monthlyTradeEarnings += Math.max(0, earning);
  }

  setDividendEarnings(earning: number) {
    this.monthlyDividendEarnings += earning;
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

  setTaxWithholding(monthlySales: number) {
    if (monthlySales < MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX) {
      return;
    }

    const taxWithholding =
      monthlySales * TAX_WITHHOLDING_PERCENTAGE[this.monthlyOperationType];

    this.monthlyTaxWithholding += taxWithholding;
  }

  setFinancialLosses(loss: number) {
    this.monthlyLoss += loss;
    this.totalLoss += loss;
  }

  updateTotalLoss(loss: number) {
    this.totalLoss = loss;
  }

  setTotalEarnings() {
    const monthlyEarnings =
      this.monthlyTradeEarnings +
      +this.monthlyDividendEarnings -
      this.monthlyTax -
      this.monthlyTaxWithholding;

    const totalEarnings = monthlyEarnings + this.totalEarnings - this.totalLoss;
    this.totalEarnings = Math.max(0, totalEarnings);
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
    const tradetEarning = this.monthlyTradeEarnings;

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

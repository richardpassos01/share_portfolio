import { TransactionDTO } from '@domain/shared/types';
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

export default class BalanceManagement {
  constructor(
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

  setMonthlyOperationType(type: MONTHLY_BALANCE_TYPE) {
    this.monthlyOperationType = type;
  }

  setType(
    buyTransactions: TransactionDTO[],
    sellTransactions: TransactionDTO[],
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

    const type = didDayTrade
      ? MONTHLY_BALANCE_TYPE.DAY_TRADE
      : MONTHLY_BALANCE_TYPE.SWING_TRADE;

    this.setMonthlyOperationType(type);
  }

  setTax(tax: number) {
    this.monthlyTax = tax;
  }

  setTaxWithholding(amount: number) {
    const taxWithholding =
      amount * TAX_WITHHOLDING_PERCENTAGE[this.monthlyOperationType];

    this.monthlyTaxWithholding = taxWithholding; // IF IT CHARGE FROM EARNINGS, IT SHOULD BE UPDATED TO += tax...
  }

  setFinancialLosses(loss: number) {
    this.monthlyLoss += loss;
    this.totalLoss += loss;
  }

  setTotalLoss(loss: number) {
    this.totalLoss = loss;
  }

  handleSellOperation(monthlySales: number, earningOrLoss: number) {
    if (earningOrLoss < 0) {
      const totalLoss = Math.abs(earningOrLoss);
      this.handleLoss(totalLoss);
    }

    if (earningOrLoss > 0) {
      this.handleEarning(monthlySales, earningOrLoss);
    }
  }

  handleEarning(monthlySales: number, earning: number) {
    this.setTradeEarning(earning);

    const shouldChargeTax = this.checkIfShouldChargeTax(monthlySales);

    if (shouldChargeTax) {
      this.setTaxWithholding(monthlySales); // SHOULD CHARGE IT FROM EARNING, BUT INTER IS HANDLE IT WRONG
      this.calculateTax();
    }
  }

  handleLoss(totalLoss: number) {
    this.setFinancialLosses(totalLoss);

    if (this.monthlyTax <= 0) {
      return;
    }

    this.calculateTax();
  }

  calculateTax() {
    const tradetEarning = this.monthlyTradeEarning;

    const taxToBeCharged =
      tradetEarning * TAX_PERCENTAGE[this.monthlyOperationType] -
      this.monthlyTaxWithholding;

    this.monthlyTax += taxToBeCharged;

    if (this.totalLoss > 0 && this.monthlyTax > 0) {
      const taxDeductedFromLoss = this.monthlyTax - this.totalLoss;

      const isRemainingTotalLoss = taxDeductedFromLoss < 0;

      if (isRemainingTotalLoss) {
        this.monthlyTax = 0;
        return this.setTotalLoss(Math.abs(taxDeductedFromLoss));
      }

      this.monthlyTax = taxDeductedFromLoss;
      this.setTotalLoss(0);
    }
  }

  checkIfDidDayTradeAtMonth(
    sellTransactions: TransactionDTO[],
    buyTransactions: TransactionDTO[],
  ) {
    return buyTransactions.find(({ ticketSymbol: buyTicket, date: BuyDate }) =>
      sellTransactions.find(({ ticketSymbol: sellTicket, date: sellDate }) => {
        const sameShare = buyTicket === sellTicket;
        const tradeInSameDay = dateToString(BuyDate) === dateToString(sellDate);

        return sameShare && tradeInSameDay;
      }),
    );
  }

  checkIfShouldChargeTax(monthlySales: number) {
    const sellMoreThanLimit =
      monthlySales > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX;

    const didDayTrade =
      this.monthlyOperationType === MONTHLY_BALANCE_TYPE.DAY_TRADE;

    return sellMoreThanLimit || didDayTrade;
  }
}

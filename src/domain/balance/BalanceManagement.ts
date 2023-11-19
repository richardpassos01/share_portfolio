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
    public monthlyTaxGross = 0,
    public monthlyLoss = 0,
    public monthlyTotalSold = 0,
    public monthlyCurrentTotalLoss = 0,
    public monthlyRestitution = 0,
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

  setTax(amout: number) {
    this.monthlyTax = amout;
  }

  setTaxWithholding(amount: number) {
    const taxWithholding =
      amount * TAX_WITHHOLDING_PERCENTAGE[this.monthlyOperationType];

    this.monthlyTaxWithholding = taxWithholding; // IF IT CHARGE FROM EARNINGS, IT SHOULD BE UPDATED TO += tax...
  }

  setTaxGross(amout: number) {
    this.monthlyTaxGross = amout;
  }

  setFinancialLosses(loss: number) {
    this.monthlyLoss += loss;
    this.totalLoss += loss;
  }

  setTotalLoss(loss: number) {
    this.totalLoss = loss;
  }

  setTotalSold(totalSold: number) {
    this.monthlyTotalSold = totalSold;
  }

  setRestitution(restitution: number) {
    this.monthlyRestitution = restitution;
  }

  setCurrentMonthlyTotslLoss(totalLoss: number) {
    this.monthlyCurrentTotalLoss = totalLoss;
  }

  handleSellOperation(monthlySales: number, earningOrLoss: number) {
    if (earningOrLoss < 0) {
      const loss = Math.abs(earningOrLoss);
      return this.handleLoss(loss);
    }

    this.handleEarning(monthlySales, earningOrLoss);
  }

  private handleEarning(monthlySales: number, earning: number) {
    this.setTradeEarning(earning);

    const shouldChargeTax = this.checkIfShouldChargeTax(monthlySales);

    if (shouldChargeTax) {
      this.setTaxWithholding(monthlySales); // SHOULD CHARGE IT FROM EARNING, BUT INTER IS HANDLE IT WRONG
      this.calculateTax();
    }
  }

  private handleLoss(loss: number) {
    this.setFinancialLosses(loss);

    const hastTaxToBeDeductFromLoss = this.monthlyTax > 0;

    if (hastTaxToBeDeductFromLoss) {
      this.deductTaxFromLoss(loss);
    }
  }

  private deductTaxFromLoss(loss: number) {
    const taxRemaining = this.monthlyTax - loss;

    if (taxRemaining > 0) {
      this.setTotalLoss(this.totalLoss - loss);
      this.setTax(taxRemaining);
    } else {
      this.setTotalLoss(this.totalLoss - this.monthlyTax);
      this.setTax(0);
    }
  }

  private deductTaxFromTotalLoss() {
    const taxRemaining = this.monthlyTax - this.totalLoss;

    if (taxRemaining > 0) {
      this.setTotalLoss(0);
      this.setTax(taxRemaining);
    } else {
      this.setTotalLoss(Math.abs(taxRemaining));
      this.setTax(0);
    }
  }

  private calculateTax() {
    const tradetEarning = this.monthlyTradeEarning;

    const taxGross = tradetEarning * TAX_PERCENTAGE[this.monthlyOperationType];
    const netTax = taxGross - this.monthlyTaxWithholding;

    this.setTax(netTax);
    this.setTaxGross(taxGross);

    if (netTax < 0) {
      this.setTax(0);
      return this.setRestitution(Math.abs(netTax));
    }

    if (this.totalLoss > 0 && this.monthlyTax > 0) {
      this.deductTaxFromTotalLoss();
    }
  }

  private checkIfDidDayTradeAtMonth(
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

  private checkIfShouldChargeTax(monthlySales: number) {
    const sellMoreThanLimit =
      monthlySales > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX;

    const didDayTrade =
      this.monthlyOperationType === MONTHLY_BALANCE_TYPE.DAY_TRADE;

    return sellMoreThanLimit || didDayTrade;
  }
}

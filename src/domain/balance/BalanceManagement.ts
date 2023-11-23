import { TransactionDTO } from '@domain/shared/types';
import {
  MONTHLY_BALANCE_SALES_LIMIT,
  MONTHLY_BALANCE_TYPE,
} from './monthlyBalance/MonthlyBalanceEnums';

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

  setMonthlyOperationType(didDayTrade: boolean) {
    const type = didDayTrade
      ? MONTHLY_BALANCE_TYPE.DAY_TRADE
      : MONTHLY_BALANCE_TYPE.SWING_TRADE;

    this.monthlyOperationType = type;
  }

  setTax(amout: number) {
    this.monthlyTax = amout;
  }

  setTaxWithholding() {
    const taxWithholding =
      this.monthlyTotalSold *
      TAX_WITHHOLDING_PERCENTAGE[this.monthlyOperationType];

    this.monthlyTaxWithholding = taxWithholding;
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

  setMonthlyTotalSold(orderTotalSold: number) {
    this.monthlyTotalSold += orderTotalSold;
  }

  setRestitution(restitution: number) {
    this.monthlyRestitution = restitution;
  }

  setMonthlyCurrentTotallLoss() {
    this.monthlyCurrentTotalLoss = this.totalLoss;
  }

  handleSellOperation(earningOrLoss: number, hasDayTrade: boolean) {
    this.setMonthlyOperationType(hasDayTrade);

    if (earningOrLoss < 0) {
      const loss = Math.abs(earningOrLoss);
      return this.handleLoss(loss);
    }

    this.handleEarning(earningOrLoss);
    this.setMonthlyCurrentTotallLoss();
  }

  private handleEarning(earning: number) {
    this.setTradeEarning(earning);

    const shouldChargeTax = this.checkIfShouldChargeTax();

    if (shouldChargeTax) {
      this.setTaxWithholding();
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

  private checkIfShouldChargeTax() {
    const sellMoreThanLimit =
      this.monthlyTotalSold > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX;

    const didDayTrade =
      this.monthlyOperationType === MONTHLY_BALANCE_TYPE.DAY_TRADE;

    return sellMoreThanLimit || didDayTrade;
  }
}

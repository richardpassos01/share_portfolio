import BalanceManagement from '@domain/portfolio/BalanceManagement';
import { MONTHLY_BALANCE_TYPE } from '@domain/portfolio/monthlyBalance/MonthlyBalanceEnums';
import { TRANSACTION_TYPE } from '@domain/shared/enums';
import TransactionFactory from '@factories/TransactionFactory';

describe('BalanceManagement', () => {
  let balanceManagement: BalanceManagement;

  beforeEach(() => {
    balanceManagement = new BalanceManagement();
  });

  it('should initialize with default values', () => {
    expect(balanceManagement.monthlyTradeEarning).toBe(0);
    expect(balanceManagement.monthlyDividendEarning).toBe(0);
    expect(balanceManagement.monthlyTax).toBe(0);
    expect(balanceManagement.monthlyTaxWithholding).toBe(0);
    expect(balanceManagement.monthlyLoss).toBe(0);
    expect(balanceManagement.monthlyOperationType).toBe(
      MONTHLY_BALANCE_TYPE.SWING_TRADE,
    );
  });

  it('should set trade earning', () => {
    balanceManagement.setTradeEarning(100);
    balanceManagement.setTradeEarning(100);
    expect(balanceManagement.monthlyTradeEarning).toBe(200);
  });

  it('should set dividend earning', () => {
    balanceManagement.setDividendEarning(50);
    balanceManagement.setDividendEarning(50);
    expect(balanceManagement.monthlyDividendEarning).toBe(100);
  });

  it('should set the operation type to DAY_TRADE', () => {
    const buyTransactions = [
      new TransactionFactory({ type: TRANSACTION_TYPE.BUY }).get(),
    ];

    const sellTransactions = [
      new TransactionFactory({ type: TRANSACTION_TYPE.SELL }).get(),
    ];

    balanceManagement.setType(buyTransactions, sellTransactions);

    expect(balanceManagement.monthlyOperationType).toBe(
      MONTHLY_BALANCE_TYPE.DAY_TRADE,
    );
  });

  it('should return if it is already DAY_TRADE', () => {
    balanceManagement.setMonthlyOperationType(MONTHLY_BALANCE_TYPE.DAY_TRADE);
    balanceManagement.checkIfDidDayTradeAtMonth = jest.fn();
    const buyTransactions = [
      new TransactionFactory({ type: TRANSACTION_TYPE.BUY }).get(),
    ];

    const sellTransactions = [
      new TransactionFactory({ type: TRANSACTION_TYPE.SELL }).get(),
    ];

    balanceManagement.setType(buyTransactions, sellTransactions);

    expect(balanceManagement.checkIfDidDayTradeAtMonth).toBeCalledTimes(0);
  });

  it('should set the operation type to SWING_TRADE', () => {
    const date = new Date();
    date.setDate(1);

    const buyTransactions = [
      new TransactionFactory({
        date,
        type: TRANSACTION_TYPE.BUY,
      }).get(),
    ];

    date.setDate(2);

    const sellTransactions = [
      new TransactionFactory({ date, type: TRANSACTION_TYPE.SELL }).get(),
    ];

    balanceManagement.setType(buyTransactions, sellTransactions);

    expect(balanceManagement.monthlyOperationType).toBe(
      MONTHLY_BALANCE_TYPE.DAY_TRADE,
    );
  });

  it('should set tax', () => {
    balanceManagement.setTax(50);
    expect(balanceManagement.monthlyTax).toBe(50);
  });

  it('should set tax withholding', () => {
    balanceManagement.setTaxWithholding(10);
    expect(balanceManagement.monthlyTaxWithholding).toBe(0.0005);
  });

  it('should set financial losses', () => {
    balanceManagement.setFinancialLosses(30);
    expect(balanceManagement.monthlyLoss).toBe(30);
    expect(balanceManagement.totalLoss).toBe(30);
  });

  it('should set total loss', () => {
    balanceManagement.setTotalLoss(50);
    expect(balanceManagement.totalLoss).toBe(50);
  });

  it('should handle sell operation with earning', () => {
    balanceManagement.handleSellOperation(100, 50);
    expect(balanceManagement.monthlyTradeEarning).toBe(50);
  });

  it('should handle sell operation with tax when sell more than 20k', () => {
    balanceManagement.handleSellOperation(20001, 50);
    expect(balanceManagement.monthlyTaxWithholding).toBe(1.00005);
    expect(balanceManagement.monthlyTax).toBe(6.49995);
  });

  it('should handle sell operation with tax when did day trade', () => {
    balanceManagement.setMonthlyOperationType(MONTHLY_BALANCE_TYPE.DAY_TRADE);

    balanceManagement.handleSellOperation(150, 50);
    expect(balanceManagement.monthlyTaxWithholding).toBe(1.5);
    expect(balanceManagement.monthlyTax).toBe(8.5);
  });

  it('should handle sell operation with loss', () => {
    balanceManagement.handleSellOperation(100, -30);
    expect(balanceManagement.monthlyLoss).toBe(30);
  });

  it('should handle sell operation with loss and deduct it from tax', () => {
    balanceManagement.setTradeEarning(30000);
    balanceManagement.handleSellOperation(100, -30);
    expect(balanceManagement.monthlyTax).toBe(4470);
  });
});

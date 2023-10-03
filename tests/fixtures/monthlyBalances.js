import { MONTHLY_BALANCE_TYPE } from '../../src/domain/monthlyBalance/MonthlyBalanceEnums.js';

export const monthlyBalances = [
  {
    yearMonth: '2019-07', // somente compra
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-07',
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-08', // teve ganho de venda, mas sem imposto por vender abaixo de 20k
    tradeEarnings: 45.499999999999886,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-08',
    tradeEarnings: 45.499999999999886,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-09',
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-09',
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-09',
    tradeEarnings: 0.0,
    dividendEarnings: 15000.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-09',
    tradeEarnings: 0.0,
    dividendEarnings: 15000.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-09', // teve ganho + dividendos, vendeu abaixo de 20k mas teve imposto de dt, deve cobrar ir somente do lucro de venda
    tradeEarnings: 9.762820512820525,
    dividendEarnings: 15000.0, // ERROR
    tax: 1.9525641025641052,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
  },
  {
    yearMonth: '2019-10', // teve perca
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 3776.1290322580644,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-11', // teve imposto, mas descontou da perca
    tradeEarnings: 110,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 1.0557,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-11',
    tradeEarnings: 110,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 1.0557,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2019-12', // somente split
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2020-01', // teve perca
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 1202,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    yearMonth: '2020-02', // somente compra
    tradeEarnings: 0.0,
    dividendEarnings: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
];

import { MONTHLY_BALANCE_TYPE } from '../../src/domain/monthlyBalance/MonthlyBalanceEnums.js';

export const monthlyBalances = [
  {
    yearMonth: '2019-07', // somente compra
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-07',
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-08', // teve ganho de venda, mas sem imposto por vender abaixo de 20k
    grossWins: 45.499999999999886,
    loss: 0.0,
    taxes: 0.0,
    netWins: 45.499999999999886,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-08',
    grossWins: 45.499999999999886,
    loss: 0.0,
    taxes: 0.0,
    netWins: 45.499999999999886,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-09',
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-09',
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-09',
    grossWins: 15000.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 15000.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado - dividendos
  {
    yearMonth: '2019-09',
    grossWins: 15000.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 15000.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-09', // teve ganho + dividendos, vendeu abaixo de 20k mas teve imposto de dt, deve cobrar ir somente do lucro de venda
    grossWins: 15009.76282051282,
    loss: 0.0,
    taxes: 1.9525641025641052,
    netWins: 15007.810256410256,
    type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
  }, // verificado - ganho
  {
    yearMonth: '2019-10', // teve perca
    grossWins: 0.0,
    loss: 3776.1290322580644,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-11', // teve imposto, mas descontou da perca
    grossWins: 110,
    loss: 0.0,
    taxes: 0.0,
    netWins: 110,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2019-11',
    grossWins: 110,
    loss: 0.0,
    taxes: 0.0,
    netWins: 110,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado - BONUS SHARE
  {
    yearMonth: '2019-12', // somente split
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado - SPLIT
  {
    yearMonth: '2020-01', // teve perca
    grossWins: 0.0,
    loss: 1202.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2020-02', // somente compra
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
  {
    yearMonth: '2020-04', // somente compra
    grossWins: 0.0,
    loss: 0.0,
    taxes: 0.0,
    netWins: 0.0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  }, // verificado
];

import { transactions } from './transactions';
import { shares } from './shares';
import { monthlyBalances } from './monthlyBalances';
import { totalBalances } from './totalBalances';
import { TransactionParams } from '@domain/shared/interfaces';

type Case = [
  TransactionParams,
  Record<any, any>,
  Record<any, any>,
  Record<any, any>,
  string,
];
const casesDescription = [
  'Should create BUY transaction, AAPL share and Monthly Balance',
  'Should update Monthly Balance with 100 GOOG shares',
  'Should sell 50 AAPL shares, update share position and balances with 45.499999999999886 BRL earnings',
  'Should buy 100 GOOG shares and update share position',
  'Should buy 1500 GOOG shares and update share position',
  'Should buy 1500 APPL shares and update share position',
  'Should buy another 1500 APPL shares and update share position',
  'Should receive 1500 in AAPL dividends and update the monthly balance',
  'Should buy 10 APPL shares and update share position',
  'Should sell 10 APPL shares in a DAY TRADE operation and receive 9.762820512820525 BRL of earning',
  'Should sell 1500 APPL shares and add a loss of 3776.12 BRL',
  'Should sell 1700 GOOG shares and earn 110 BRL and liquidate the position',
  'Should buy 10 APPL shares and update share position',
  'Should split APPL shares into 160 shares',
  'Should sell 160 APPL shares with loss of 1202 BRl and liquidate the position',
  'Should buy 100 TSLA shares',
  'Should sell 1 TSLA share and earn 9988.535 BRL',
  'Should liquidate TSLA shares and earn 1991990 BRL',
];

export const createTransactionCases: Case[] = transactions.map(
  (transaction, i) => [
    transaction,
    shares[i],
    monthlyBalances[i],
    totalBalances[i],
    casesDescription[i],
  ],
);

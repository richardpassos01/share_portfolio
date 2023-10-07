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
  'Should create transaction, AAPL Share and MonthlyBalance',
  'Should update MonthlyBalance with new GOOG share buyed',
  'Should sell 50 AAPL shares, update currently position and update balances earnings',
  'Should buy 100 GOOG shares and update currently position',
  'Should buy 1500 GOOG shares and update currently position',
  'Should buy 1500 APPL shares and update currently position',
  'Should buy more 1500 APPL shares and update currently position',
  'Should receive 1500 of dividends and update balance',
  'Should buy 10 APPL shares and update currently position',
  'Should sell 10 APPL shares in DAY TRADE operation',
  'Should sell 1500 APPL shares and loss 3776.12 BRL',
  'Should sell 1700 GOOG shares and earning money 110 BRL and liquidate position',
  'Should buy 10 APPL shares and update currently position',
  'Should split APPL shares into 160 shares',
  'Should sell 160 APPL shares and liquidate position',
  'Should buy 100 TSLA shares',
  'Should sell 1 TSLA share and earning 9988.535 BRL',
  'Should liquidate TSLA shares and earning 1991990 BRL',
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

import { transactions } from './transactions';
import { shares } from './shares';
import { monthlyBalances } from './monthlyBalances';
import { totalBalances } from './totalBalances';
import { TransactionParams } from '@domain/shared/interfaces';

type Case = [
  TransactionParams, 
  Record<any, any>, 
  Record<any, any>, 
  Record<any, any>
];

export const createTransactionCases: Case[] = transactions.map((transaction, i) => [
  transaction,
  shares[i],
  monthlyBalances[i],
  totalBalances[i],
]);

import { transactions } from './transactions';
import { shares } from './shares';
import { monthlyBalances } from './monthlyBalances';
import { totalBalances } from './totalBalances';
import { CreateTransactionParams } from '@domain/shared/types';

type Case = [
  CreateTransactionParams,
  Record<any, any>,
  Record<any, any>,
  Record<any, any>,
  string,
];
const casesDescription = [
  'Should create share and Monthly Balance if it does not exist',
  'Should update Monthly Balance with new shares',
  'Should update tradeEarning and dont charge tax if it does not meet tax conditions',
  'Should update share position when buy share',
  'Should update share position when buy share',
  'Should update share position when buy share',
  'Should update dividendEarning when is a DIVIDENDS transaction',
  'Should update share position when buy share',
  'Should charge daytrade tax when buy and sell shares of the same company in the same day',
  'Should update total loss and recalculate tax by deducting it',
  'Should not charge tax if meets tax conditions but has remaining total balance loss',
  'Should add shares and dont update the total cost when has bonus share transaction',
  'Should replace the share quantity with the transaction quantity into split transaction',
  'Should delete share when sell all shares of the company',
  'Should create new share',
  'Should update share',
  'Should not charge tax if sell less than 20k on month and dont did day trade',
  'Should charge tax when selling more than 20k on month',
  'Should not change total balance when buy new shares',
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

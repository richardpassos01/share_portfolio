import { transactionsParams } from './transactions';
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
  'should create share and Monthly Balance if it does not exist',
  'should update Monthly Balance with new shares',
  'should update tradeEarning and dont charge tax if it does not meet tax conditions',
  'should update share position when buy share',
  'should update share position when buy share',
  'should update share position when buy share',
  'should update dividendEarning when is a DIVIDENDS transaction',
  'should update share position when buy share',
  'should charge daytrade tax when buy and sell shares of the same company in the same day',
  'should update total loss and recalculate tax by deducting it',
  'should not charge tax if meets tax conditions but has remaining total balance loss',
  'should add shares and dont update the total cost when has bonus share transaction',
  'should replace the share quantity with the transaction quantity into split transaction',
  'should delete share when sell all shares of the company',
  'should create new share',
  'should update share',
  'should not charge tax if sell less than 20k on month and dont did day trade',
  'should charge tax when selling more than 20k on month',
  'should not change total balance when buy new shares',
];

export const createTransactionCases: Case[] = transactionsParams.map(
  (transaction, i) => [
    transaction,
    shares[i],
    monthlyBalances[i],
    totalBalances[i],
    casesDescription[i],
  ],
);

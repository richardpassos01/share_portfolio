import { transactions } from './transactions.js';
import { shares } from './shares.js';
import { monthlyBalances } from './monthlyBalances.js';
import { totalBalances } from './totalBalances';

export const createTransactionCases = transactions.map((transaction, i) => [
  transaction,
  shares[i],
  monthlyBalances[i],
  totalBalances[i],
]);

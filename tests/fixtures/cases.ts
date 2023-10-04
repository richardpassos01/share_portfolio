import { transactions } from './transactions';
import { shares } from './shares';
import { monthlyBalances } from './monthlyBalances';
import { totalBalances } from './totalBalances';

export const createTransactionCases = transactions.map((transaction, i) => [
  transaction,
  shares[i],
  monthlyBalances[i],
  totalBalances[i],
]);

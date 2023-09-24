/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  updatePortfolio,
  transactionRepository,
} from '../../DependencyInjectionContainer.js';

import { dateToMonthYear } from '../../helpers/Helpers.js';

const groupByMonth = (transactions) =>
  transactions.reduce((acc, transaction) => {
    const yearMonth = dateToMonthYear(transaction.date);

    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }

    acc[yearMonth].push(transaction);

    return acc;
  }, {});

(async () => {
  const transactions = await transactionRepository.getTrades(
    'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
  );
  const grouppedTransactions = groupByMonth(transactions);

  for (const yearMonth of Object.keys(grouppedTransactions)) {
    for (const transaction of grouppedTransactions[yearMonth]) {
    }

    await updatePortfolio.execute(transaction);
  }
})();

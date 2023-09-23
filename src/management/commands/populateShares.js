/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  database,
  updateInstitutionPosition,
  transactionRepository,
} from '../../DependencyInjectionContainer.js';
import Tables from '../../infrastructure/database/Tables.js';
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '../../domain/transaction/TransactionEnums.js';

const groupByMonth = (transactions) =>
  transactions.reduce((acc, item) => {
    const yearMonth = item.date.toISOString().slice(0, 7);

    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }

    acc[yearMonth].push(item);

    return acc;
  }, {});

(async () => {
  const transactions = await transactionRepository.getTrades();
  const grouppedTransactions = groupByMonth(transactions);

  for (const group of Object.keys(grouppedTransactions)) {
    for (const transaction of grouppedTransactions[group]) {
      await updateInstitutionPosition.execute(transaction);
    }
  }

  for (const transaction of transactions) {
    await updateInstitutionPosition.execute(transaction);
    // calcular tax
  }

  database.disconnect();
})();

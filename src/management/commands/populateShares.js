/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  database,
  updateInstitutionPosition,
  transactionRepository,
  shareRepository,
} from '../../DependencyInjectionContainer.js';
import Tables from '../../infrastructure/database/Tables.js';
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '../../domain/transaction/TransactionEnums.js';
import Balance from '../../domain/transaction/balance/Balance.js';
import { dateToMonthYear } from '../../helpers/Helpers.js';

const TAX_FREE_SALES_LIMIT = 20000;

const groupByMonth = (transactions) =>
  transactions.reduce((acc, item) => {
    const yearMonth = dateToMonthYear(item.date);

    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }

    acc[yearMonth].push(item);

    return acc;
  }, {});

// const dateToString = (date) => date.toISOString().slice(0, 10);

// const calculateWinsOrLossSellOperation = (share, transaction) => {
//   const sellCost = transaction.totalCost; // preço de venda

//   const minIdealSellCost = transaction.quantity * share.mediumPrice; // valor minimo para nao ter perca/ganho

//   const winsOrloss = sellCost - minIdealSellCost; // se resultado for negativo, tive perca, se nao, ganho

//   return winsOrloss;
// };

// const containsDayTrade = (monthTransactions, transaction) =>
//   monthTransactions.findIndex(
//     (t) =>
//       dateToString(t.date) === dateToString(transaction.date) &&
//       t.type === TRANSACTION_TYPE.BUY,
//   ) > -1;

// const applyTaxPercentage = (value, dayTrade) =>
//   dayTrade ? value * 1.2 : value * 1.15;

// const calculateTaxPayment = (monthTransactions, dayTrade) => {
//   const sellOperations = monthTransactions.filter(
//     (t) => t.type === TRANSACTION_TYPE.SELL,
//   );

//   const totalSell = sellOperations.reduce((acc, t) => acc + t.totalCost, 10);

//   if (totalSell > TAX_FREE_SALES_LIMIT || dayTrade) {
//     const tax = applyTaxPercentage(totalSell, dayTrade);
//     return tax;
//   }

//   return 0;
// };

(async () => {
  const transactions = await transactionRepository.getTrades(
    'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
  );
  const grouppedTransactions = groupByMonth(transactions);

  for (const yearMonth of Object.keys(grouppedTransactions)) {
    const balance = new Balance({
      yearMonth,
    });
    balance.setType(grouppedTransactions[yearMonth]);

    for (const transaction of grouppedTransactions[yearMonth]) {
      if (transaction.type === TRANSACTION_TYPE.SELL) {
        // const share = await shareRepository.get(
        //   transaction.ticketSymbol,
        //   transaction.institutionId,
        // );

        // const winsOrloss = calculateWinsOrLossSellOperation(share, transaction);

        if (winsOrloss < 0) {
          console.log('perca');
        }

        if (winsOrloss > 0) {
          console.log('ganho');
          const sellOperations = grouppedTransactions[yearMonth].filter(
            (t) => t.type === TRANSACTION_TYPE.SELL,
          );

          balance.calculateTaxes(sellOperations);

          // veririficar se tem que pagar imposto
        }

        console.log('nada');

        console.log(dayTrade);
        // get da share atual
        // verificar se teve ganha/perca
        // veririficar se foi day trade (checkar se updated_at da share, é o mesmo que hoje), qql coisa atualizar bilence
        // atualizar balance
      }

      await updateInstitutionPosition.execute(transaction); // vai atualizar/criar registro share

      // se venda, vai atualizar o balance
    }

    // atualizar imposto balance

    console.log('atualizar balanco do mes');

    // console.log(grouppedTransactions[group]);

    //   month_balance/
    //   balanço do mes'
    //   {
    //     yearMonth: '2022-10'
    //     totalWin: 100,
    //     totalLoss: 100,
    //     totalTaxes: 1000 | 0,
    //     hasDayTradeOperation: false
    //   }
  }

  for (const transaction of transactions) {
    await updateInstitutionPosition.execute(transaction);
    // calcular tax
  }

  database.disconnect();
})();

/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { readdirSync, promises as fsPromises } from 'fs';
import { resolve } from 'path';
import { parse } from 'node-xlsx';
import { URL } from 'url';
import { database } from '../../DependencyInjectionContainer.js';
import Tables from '../../infrastructure/database/Tables.js';
import TransactionMapper from '../../infrastructure/mappers/TransactionMapper.js';
import Transaction from '../../domain/transaction/Transaction.js';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums.js';

const __dirname = new URL('.', import.meta.url).pathname;

const filesPath = resolve(__dirname, '..', 'files');
const fileList = readdirSync(filesPath);

const institutionEventTypeMapper = {
  Credito: TRANSACTION_TYPE.OUTBOUND,
  Debito: TRANSACTION_TYPE.INBOUND,
  'Transferência - Liquidação': TRANSACTION_CATEGORY.TRADE,
  Rendimento: TRANSACTION_CATEGORY.DIVIDENDS,
  'Juros Sobre Capital Próprio': TRANSACTION_CATEGORY.DIVIDENDS,
  Dividendo: TRANSACTION_CATEGORY.DIVIDENDS,
  'Direitos de Subscrição - Não Exercido': TRANSACTION_CATEGORY.OTHER,
  'Cessão de Direitos - Solicitada': TRANSACTION_CATEGORY.OTHER,
  'Cessão de Direitos': TRANSACTION_CATEGORY.OTHER,
  'Direito de Subscrição': TRANSACTION_CATEGORY.OTHER,
  Atualização: TRANSACTION_CATEGORY.OTHER,
  Desdobro: TRANSACTION_CATEGORY.OTHER,
  'Bonificação em Ativos': TRANSACTION_CATEGORY.OTHER,
};

const parseDataString = (dateString) =>
  new Date(dateString.split('/').reverse().join('-'));

const createTransaction = (transaction) =>
  new Transaction({
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: institutionEventTypeMapper[transaction[0]],
    date: parseDataString(transaction[1]),
    category: institutionEventTypeMapper[transaction[2]],
    ticketSymbol: transaction[3].split(' - ')[0],
    quantity: transaction[5],
    unityPrice: transaction[6] !== '-' ? transaction[6] : null,
    totalPrice: transaction[7] !== '-' ? transaction[7] : null,
  });

const formatTransactionsForDatabase = (transactions) =>
  transactions.map((transaction) =>
    TransactionMapper.mapToDatabaseObject(transaction),
  );

(async () => {
  await database.checkConnection();

  for (const fileName of fileList) {
    // if (fileName.split('-')[0] === 'inserted') {
    //   continue;
    // }

    const filePath = resolve(filesPath, fileName);
    const [{ data }] = parse(filePath);
    const transactions = data.slice(1).map(createTransaction);
    const formattedTransactions = formatTransactionsForDatabase(transactions);

    try {
      await database
        .connection()
        .insert(formattedTransactions)
        .into(Tables.TRANSACTION);

      // await fsPromises.rename(
      //   filePath,
      //   resolve(filesPath, `inserted-${fileName}`),
      // );

      console.log(`file ${fileName} inserted`);
    } catch (error) {
      console.log(error);
    }
  }

  database.disconnect();
})();

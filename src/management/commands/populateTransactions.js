/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { readdirSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'node-xlsx';
import { URL } from 'url';
import { createTransaction } from '../../DependencyInjectionContainer.js';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums.js';
import { dateStringToDate } from '../../helpers/Helpers.js';

const __dirname = new URL('.', import.meta.url).pathname;

const filesPath = resolve(__dirname, '..', 'files');
const fileList = readdirSync(filesPath);

const institutionEventTypeMapper = {
  Credito: TRANSACTION_TYPE.BUY,
  Debito: TRANSACTION_TYPE.SELL,
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

(async () => {
  try {
    for (const fileName of fileList.filter((f) => f.includes('xlsx'))) {
      // if (fileName.split('-')[0] === 'inserted') {
      //   continue;
      // }

      const filePath = resolve(filesPath, fileName);
      const [{ data }] = parse(filePath);

      for (const transactionObject of data.slice(1).reverse()) {
        if (
          transactionObject[1].slice(3) === '08/2023' ||
          transactionObject[1] === '27/07/2023'
        ) {
          console.log('1');
        }

        await createTransaction.execute({
          institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
          type: institutionEventTypeMapper[transactionObject[0]],
          date: dateStringToDate(transactionObject[1]),
          category: institutionEventTypeMapper[transactionObject[2]],
          ticketSymbol: transactionObject[3].split(' - ')[0],
          quantity: transactionObject[5],
          unityPrice: transactionObject[6] !== '-' ? transactionObject[6] : 0,
          totalCost: transactionObject[7] !== '-' ? transactionObject[7] : 0,
        });
      }

      // await fsPromises.rename(
      //   filePath,
      //   resolve(filesPath, `inserted-${fileName}`),
      // );

      console.log(`file ${fileName} inserted`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
})();

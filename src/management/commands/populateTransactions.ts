/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { readdirSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'node-xlsx';
import { URL } from 'url';
import { createTransaction } from '../../DependencyInjectionContainer';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums';
import { dateStringToDate } from '../../helpers/Helpers';

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
  Desdobro: TRANSACTION_CATEGORY.SPLIT,
  'Bonificação em Ativos': TRANSACTION_CATEGORY.BONUS_SHARE, // ganhos de share
  'Direitos de Subscrição - Não Exercido': TRANSACTION_CATEGORY.OTHER,
  'Cessão de Direitos - Solicitada': TRANSACTION_CATEGORY.OTHER,
  'Cessão de Direitos': TRANSACTION_CATEGORY.OTHER,
  'Direito de Subscrição': TRANSACTION_CATEGORY.OTHER,
  Atualização: TRANSACTION_CATEGORY.OTHER, // somente um update falando a quantidade atual de share
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
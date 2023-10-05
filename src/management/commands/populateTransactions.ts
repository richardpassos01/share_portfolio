/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { readdirSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'node-xlsx';
import container from '@dependencyInjectionContainer';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '@domain/shared/constants';
import { dateStringToDate } from '../../helpers/Helpers';
import CreateTransaction from '@application/useCases/CreateTransaction';
import { TYPES } from '@constants/types';

const filesPath = resolve(__dirname, '..', 'files');
const fileList = readdirSync(filesPath);

const institutionEventTypeMapper: Record<any, any> = {
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

const createTransaction = container.get<CreateTransaction>(
  TYPES.CreateTransaction,
);

const fn = async () => {
  for (const fileName of fileList.filter((f) => f.includes('xlsx'))) {
    const filePath = resolve(filesPath, fileName);
    const [{ data }] = parse(filePath);

    for (const transactionObject of data.slice(1).reverse()) {
      await createTransaction
        .execute({
          institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
          type: institutionEventTypeMapper[transactionObject[0]],
          date: dateStringToDate(transactionObject[1]),
          category: institutionEventTypeMapper[transactionObject[2]],
          ticketSymbol: transactionObject[3].split(' - ')[0],
          quantity: transactionObject[5],
          unityPrice: transactionObject[6] !== '-' ? transactionObject[6] : 0,
          totalCost: transactionObject[7] !== '-' ? transactionObject[7] : 0,
        })
        .catch((error) => {
          console.error(`Error creating transaction: ${error}`);
        });
    }

    console.log(`File ${fileName} inserted`);
  }
};

fn()
  .then(() => {
    console.log('Finished');
  })
  .catch((error) => console.error(error));

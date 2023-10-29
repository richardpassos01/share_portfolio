/* eslint-disable no-process-exit */
import 'reflect-metadata';

import { readdirSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'node-xlsx';
import container from '@dependencyInjectionContainer';
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { dateStringDDMMYYYYToYYYYMMDD } from '../../helpers';
import CreateTransactions from '@application/useCases/CreateTransactions';
import { TYPES } from '@constants/types';
import { CreateTransactionParams } from '@domain/shared/types';

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
  'Bonificação em Ativos': TRANSACTION_CATEGORY.BONUS_SHARE,
  'Direitos de Subscrição - Não Exercido': TRANSACTION_CATEGORY.OTHER,
  'Cessão de Direitos - Solicitada': TRANSACTION_CATEGORY.OTHER,
  'Cessão de Direitos': TRANSACTION_CATEGORY.OTHER,
  'Direito de Subscrição': TRANSACTION_CATEGORY.OTHER,
  Atualização: TRANSACTION_CATEGORY.OTHER,
};

const createTransactions = container.get<CreateTransactions>(
  TYPES.CreateTransactions,
);

const command = async () => {
  try {
    const formattedTransactions: CreateTransactionParams[] = [];

    fileList
      .filter((f) => f.includes('xlsx'))
      .forEach((fileName) => {
        const filePath = resolve(filesPath, fileName);
        const [{ data }] = parse(filePath);

        const transactions: CreateTransactionParams[] = data
          .slice(1)
          .map((transaction) => ({
            type: institutionEventTypeMapper[transaction[0]],
            date: dateStringDDMMYYYYToYYYYMMDD(transaction[1]),
            category: institutionEventTypeMapper[transaction[2]],
            ticketSymbol: transaction[3].split(' - ')[0],
            quantity: transaction[5],
            unitPrice: transaction[6] !== '-' ? transaction[6] : 0,
            totalCost: transaction[7] !== '-' ? transaction[7] : 0,
          }));

        formattedTransactions.push(...transactions);
        console.log(`File ${fileName} processed`);
      });

    await createTransactions.execute(
      'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      formattedTransactions,
    );
    console.log('transactions created');
  } catch (error) {
    console.error('Error to create transactions', error);
  }
};

command()
  .then(() => {
    console.log('Finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

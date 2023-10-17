import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { CreateTransactionParams } from '@domain/shared/types';
import Transaction from '@domain/transaction/Transaction';
import TransactionFactory from '@factories/TransactionFactory';
import institution from '@fixtures/institution';

export const transactionsParams: CreateTransactionParams[] = [
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-07-31',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 20.19,
    totalCost: 2019.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-07-31',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 100,
    unityPrice: 12.54,
    totalCost: 1254.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2019-08-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 50,
    unityPrice: 21.1,
    totalCost: 1055.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-08-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 100,
    unityPrice: 13.0,
    totalCost: 1300.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-09-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-09-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-09-10',
    category: TRANSACTION_CATEGORY.DIVIDENDS,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-09-11',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 12.3,
    totalCost: 123,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2019-09-11',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 13.5,
    totalCost: 135,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2019-10-05',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2019-11-15',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1700,
    unityPrice: 12.42,
    totalCost: 21114,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-11-16',
    category: TRANSACTION_CATEGORY.BONUS_SHARE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 0,
    totalCost: 0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2019-12-01',
    category: TRANSACTION_CATEGORY.SPLIT,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 0,
    totalCost: 0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2020-01-02',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 160,
    unityPrice: 20,
    totalCost: 3200,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2020-02-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 100,
    unityPrice: 10,
    totalCost: 1000,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2020-03-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 100,
    unityPrice: 12.93,
    totalCost: 1293,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2021-02-01',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 1,
    unityPrice: 10000,
    totalCost: 10000,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: '2021-02-02',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 199,
    unityPrice: 10010,
    totalCost: 1991990,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: '2022-05-20',
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AMZN',
    quantity: 100,
    unityPrice: 130,
    totalCost: 13000,
  },
];

export const listTransactions = (): Transaction[] => {
  return [
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-07-31',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 100,
      unityPrice: 20.19,
      totalCost: 2019.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-07-31',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'GOOG',
      quantity: 100,
      unityPrice: 12.54,
      totalCost: 1254.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-08-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'GOOG',
      quantity: 100,
      unityPrice: 13.0,
      totalCost: 1300.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2019-08-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 50,
      unityPrice: 21.1,
      totalCost: 1055.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-09-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 1500,
      unityPrice: 12.3,
      totalCost: 18450.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-09-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'GOOG',
      quantity: 1500,
      unityPrice: 12.3,
      totalCost: 18450.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-09-10',
      category: TRANSACTION_CATEGORY.DIVIDENDS,
      ticketSymbol: 'AAPL',
      quantity: 1500,
      unityPrice: 10,
      totalCost: 15000.0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-09-11',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 10,
      unityPrice: 12.3,
      totalCost: 123,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2019-09-11',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 10,
      unityPrice: 13.5,
      totalCost: 135,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2019-10-05',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 1500,
      unityPrice: 10,
      totalCost: 15000,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2019-11-15',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'GOOG',
      quantity: 1700,
      unityPrice: 12.42,
      totalCost: 21114,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-11-16',
      category: TRANSACTION_CATEGORY.BONUS_SHARE,
      ticketSymbol: 'AAPL',
      quantity: 10,
      unityPrice: 0,
      totalCost: 0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2019-12-01',
      category: TRANSACTION_CATEGORY.SPLIT,
      ticketSymbol: 'AAPL',
      quantity: 100,
      unityPrice: 0,
      totalCost: 0,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2020-01-02',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AAPL',
      quantity: 160,
      unityPrice: 20,
      totalCost: 3200,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2020-02-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'TSLA',
      quantity: 100,
      unityPrice: 10,
      totalCost: 1000,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2020-03-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'TSLA',
      quantity: 100,
      unityPrice: 12.93,
      totalCost: 1293,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2021-02-01',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'TSLA',
      quantity: 1,
      unityPrice: 10000,
      totalCost: 10000,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.SELL,
      date: '2021-02-02',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'TSLA',
      quantity: 199,
      unityPrice: 10010,
      totalCost: 1991990,
    }).get(),
    new TransactionFactory({
      institutionId: institution.id,
      type: TRANSACTION_TYPE.BUY,
      date: '2022-05-20',
      category: TRANSACTION_CATEGORY.TRADE,
      ticketSymbol: 'AMZN',
      quantity: 100,
      unityPrice: 130,
      totalCost: 13000,
    }).get(),
  ];
};

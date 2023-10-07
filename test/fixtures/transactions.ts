import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '@domain/shared/constants';
import { TransactionParams } from '@domain/shared/interfaces';
import institution from '@fixtures/institution';

export const transactions: TransactionParams[] = [
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-07-31T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 20.19,
    totalCost: 2019.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-07-31T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 100,
    unityPrice: 12.54,
    totalCost: 1254.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-08-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 50,
    unityPrice: 21.1,
    totalCost: 1055.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-08-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 100,
    unityPrice: 13.0,
    totalCost: 1300.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-10T00:00:00'),
    category: TRANSACTION_CATEGORY.DIVIDENDS,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000.0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-11T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 12.3,
    totalCost: 123,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-09-11T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 13.5,
    totalCost: 135,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-10-05T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-11-15T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1700,
    unityPrice: 12.42,
    totalCost: 21114,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-11-16T00:00:00'),
    category: TRANSACTION_CATEGORY.BONUS_SHARE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 0,
    totalCost: 0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-12-01T00:00:00'),
    category: TRANSACTION_CATEGORY.SPLIT,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 0,
    totalCost: 0,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2020-01-02T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 160,
    unityPrice: 20,
    totalCost: 3200,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2020-02-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 100,
    unityPrice: 10,
    totalCost: 1000,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2020-03-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 100,
    unityPrice: 12.93,
    totalCost: 1293,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2021-02-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 1,
    unityPrice: 10000,
    totalCost: 10000,
  },
  {
    institutionId: institution.id,
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2021-02-02T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 199,
    unityPrice: 10010,
    totalCost: 1991990,
  },
];

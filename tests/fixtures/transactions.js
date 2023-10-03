import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../src/domain/transaction/TransactionEnums.js';

export const transactions = [
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-07-31T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 20.19,
    totalCost: 2019.0,
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-07-31T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 100,
    unityPrice: 12.54,
    totalCost: 1254.0,
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // EARNING 45.499999999999886
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-08-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 50,
    unityPrice: 21.1,
    totalCost: 1055.0, // Holding 50 shares with total cost of 964 and pm of 19.28
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-08-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 100,
    unityPrice: 13.0,
    totalCost: 1300.0,
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0, // Holding 1700 shares with total cost of 21004 and pm of 12.355294117647059
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0, // Holding 1550 shares with total cost of 19414 and pm of 12.52516129032258
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-10T00:00:00'),
    category: TRANSACTION_CATEGORY.DIVIDENDS,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000.0,
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-11T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 12.3,
    totalCost: 123, // Holding 1560 shares with total cost of 19537 and pm of 12.523717948717948
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // EARNING 9.762820512820525
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-09-11T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 13.5,
    totalCost: 135, // Holding 1550 shares with total cost of 19402 and pm of 12.51741935483871
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // LOSS -3776.1290322580644
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-10-05T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000, // Holding 50 shares with total cost of 4402 and pm of 88.04
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // EARNING 110
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-11-15T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1700,
    unityPrice: 12.42,
    totalCost: 21114, // Holding 0 shares with total cost of 0 and pm of 0
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-11-16T00:00:00'),
    category: TRANSACTION_CATEGORY.BONUS_SHARE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 0,
    totalCost: 0, // Holding 60 shares with total cost of 4402 and pm of 73.36666666666666
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-12-01T00:00:00'),
    category: TRANSACTION_CATEGORY.SPLIT,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 0,
    totalCost: 0, // Holding 160 shares with total cost of 4402 and pm of 27.5125
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // LOSS 1202
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2020-01-02T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 160,
    unityPrice: 20,
    totalCost: 3200, // Holding 0 shares with total cost of 0 and pm of 0
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2020-02-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'TSLA',
    quantity: 100,
    unityPrice: 10,
    totalCost: 1000,
  },
];

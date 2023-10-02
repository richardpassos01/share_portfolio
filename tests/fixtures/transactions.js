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
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // LUCRO de 45.499999999999886
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-08-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 50,
    unityPrice: 21.1,
    totalCost: 1055.0, // restando 50 com custo total de 964, pm de 19.28
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
    quantity: 1500, // 1700
    unityPrice: 12.3, // 12.355294117647059
    totalCost: 18450.0, // 21004
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-09-01T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 12.3,
    totalCost: 18450.0, // restando 1550 com custo total de 19414, pm de 12.52516129032258
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
    totalCost: 123, // restando 1560 com custo total de 19537, pm de 12.523717948717948
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // lucro 9.762820512820525
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-09-11T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE, // ERRO
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 13.5,
    totalCost: 135, // restando 1550 com custo total de 19402, pm de 12.51741935483871
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // Perca -3776.1290322580644
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-10-05T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 1500,
    unityPrice: 10,
    totalCost: 15000, // restando 50 com custo total de 4402, pm de 88.04
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // lucro 110
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2019-11-15T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'GOOG',
    quantity: 1700,
    unityPrice: 12.42,
    totalCost: 21114, // restando 0 com custo total de 0, pm de 0
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-11-16T00:00:00'),
    category: TRANSACTION_CATEGORY.BONUS_SHARE,
    ticketSymbol: 'AAPL',
    quantity: 10,
    unityPrice: 0,
    totalCost: 0, // restando 60 com custo total de 4402, pm de 73.36666666666666
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type: TRANSACTION_TYPE.BUY,
    date: new Date('2019-12-01T00:00:00'),
    category: TRANSACTION_CATEGORY.SPLIT,
    ticketSymbol: 'AAPL',
    quantity: 100,
    unityPrice: 0,
    totalCost: 0, // restando 160 com custo total de 4402, pm de 27.5125
  },
  {
    institutionId: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2', // perca de 1202
    type: TRANSACTION_TYPE.SELL,
    date: new Date('2020-01-02T00:00:00'),
    category: TRANSACTION_CATEGORY.TRADE,
    ticketSymbol: 'AAPL',
    quantity: 160,
    unityPrice: 20,
    totalCost: 3200, // restando 0 com custo total de 0, pm de 0
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

  // custo_total_novo = custo_total - custo_transaction
  // qtd = quantitade - quantidade_nova
  // p.m = custo_total_novo / qtd
  // lucroPerda = (custo_transaction) - (quantidade_nova * pm_antigo)
];

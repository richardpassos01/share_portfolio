import { MONTHLY_BALANCE_TYPE } from '@domain/financialReport/monthlyBalance/MonthlyBalanceEnums';
import institution from '@fixtures/institution';

export const monthlyBalances = [
  {
    institutionId: institution.id,
    yearMonth: '2019-07',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-07',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-08', // There were Earning in the month and sales was lower than 20k, so dont need to pay tax.
    tradeEarning: 45.499999999999886,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-08',
    tradeEarning: 45.499999999999886,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-09',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-09',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-09',
    tradeEarning: 0.0,
    dividendEarning: 15000.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-09',
    tradeEarning: 0.0,
    dividendEarning: 15000.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-09', // There were Earning in the month and sales with a total value lower than 20k, but need to pay taxes because did day trade.
    tradeEarning: 9.762820512820525,
    dividendEarning: 15000.0,
    tax: 1.9525641025641052,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-10',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 3776.1290322580644,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id, // There were Earning in the month and sales with a total value greater than 20k, but there's no need to pay taxes because it can be deducted from the total loss
    yearMonth: '2019-11',
    tradeEarning: 110,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 1.0557,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-11',
    tradeEarning: 110,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 1.0557,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2019-12',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2020-01',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 1202,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2020-02',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2020-03',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2021-02',
    tradeEarning: 9988.535,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2021-02',
    tradeEarning: 2001978.535,
    dividendEarning: 0.0,
    tax: 295234.49601774185,
    taxWithholding: 99.5995,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
];

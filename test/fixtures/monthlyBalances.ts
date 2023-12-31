import { MONTHLY_BALANCE_TYPE } from '@domain/balance/monthlyBalance/MonthlyBalanceEnums';
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
    tax: 0.6025641025641051,
    taxWithholding: 1.35,
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
    loss: 3785.576923076922,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id, // There were Earning in the month and sales with a total value greater than 20k, but there's no need to pay taxes because it can be deducted from the total loss
    yearMonth: '2019-11',
    tradeEarning: 110,
    dividendEarning: 0.0,
    tax: 0.0, // result should be 16.4945, and deduct it from total balance loss
    taxWithholding: 1.0557, // it sould be charged from EARNINGS, but INTER does it wrong, result should be 0.0055000000000000005
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
    tax: 295224.54812692304,
    taxWithholding: 100.0995,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
  {
    institutionId: institution.id,
    yearMonth: '2022-05',
    tradeEarning: 0.0,
    dividendEarning: 0.0,
    tax: 0.0,
    taxWithholding: 0.0,
    loss: 0,
    type: MONTHLY_BALANCE_TYPE.SWING_TRADE,
  },
];

export const listMonthlyBalances = () => {
  const lastRecordOfEachMonth = monthlyBalances.filter(
    (current, index, array) => {
      if (index === array.length - 1) {
        return true;
      }
      return current.yearMonth !== array[index + 1].yearMonth;
    },
  );

  return lastRecordOfEachMonth.sort((a, b) =>
    b.yearMonth.localeCompare(a.yearMonth),
  );
};

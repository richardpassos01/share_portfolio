import currencyConfig from '../config/currency.js';

export const dateToMonthYear = (date) => date.toISOString().slice(0, 7);
export const dateToString = (date) => date.toISOString().slice(0, 10);
export const dateStringToDate = (dateString) =>
  new Date(dateString.split('/').reverse().join('-').concat('T00:00:00'));
export const formatterMoney = (
  amount,
  { region, currency } = currencyConfig.brazil,
) =>
  new Intl.NumberFormat(region, {
    style: 'currency',
    currency,
  }).format(amount);

import currencyConfig from '../config/currency';

export const dateToMonthYear = (date: Date): string =>
  date.toISOString().slice(0, 7);
export const dateToString = (date: Date): string =>
  date.toISOString().slice(0, 10);
export const dateStringDDMMYYYYToDate = (dateString: string): Date =>
  new Date(dateString.split('/').reverse().join('-').concat('T00:00:00'));
export const dateStringToDate = (dateString: string): Date =>
  new Date(dateString.concat('T00:00:00'));
export const formatterMoney = (
  amount: number,
  { region, currency } = currencyConfig.brazil,
): string =>
  new Intl.NumberFormat(region, {
    style: 'currency',
    currency,
  }).format(amount);

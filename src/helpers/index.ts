import currencyConfig from '../config/currency';

export const dateToMonthYear = (date: Date): string =>
  date.toISOString().slice(0, 7);
export const dateToString = (date: Date): string =>
  date.toISOString().slice(0, 10);
export const dateStringDDMMYYYYToYYYYMMDD = (dateString: string): string =>
  dateString.split('/').reverse().join('-');
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
export const isSameMonthYear = (date1: Date, date2: Date): boolean => {
  return dateToMonthYear(date1) === dateToMonthYear(date2);
};
export const convertToUniqueArray = (
  value: string | string[] | null | undefined,
) => {
  if (!value) return [];

  const set = new Set(Array.isArray(value) ? value : [value]);
  return [...set];
};

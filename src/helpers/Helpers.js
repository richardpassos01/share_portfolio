export const dateToMonthYear = (date) => date.toISOString().slice(0, 7);
export const dateToString = (date) => date.toISOString().slice(0, 10);
export const dateStringToDate = (dateString) =>
  new Date(dateString.split('/').reverse().join('-').concat('T00:00:00'));

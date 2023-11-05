import institution from '@fixtures/institution';

export const totalBalances = [
  { institutionId: institution.id, netEarning: 0, loss: 0 },
  { institutionId: institution.id, netEarning: 0, loss: 0 },
  { institutionId: institution.id, netEarning: 45.499999999999886, loss: 0 },
  { institutionId: institution.id, netEarning: 45.499999999999886, loss: 0 },
  { institutionId: institution.id, netEarning: 45.499999999999886, loss: 0 },
  { institutionId: institution.id, netEarning: 45.499999999999886, loss: 0 },
  { institutionId: institution.id, netEarning: 15045.5, loss: 0 },
  { institutionId: institution.id, netEarning: 15045.5, loss: 0 },
  { institutionId: institution.id, netEarning: 15053.310256410256, loss: 0 },
  {
    institutionId: institution.id,
    netEarning: 11267.733333333334,
    loss: 3785.576923076922,
  },
  /* Postgres rounds differently from JavaScript,
  which leads to a variation in values.
  In JavaScript, the earnings calculation yields 11392.121933333332.
  However, when the calculation is performed within Postgres, we obtain a different result.*/
  {
    institutionId: institution.id,
    netEarning: 11392.121933333336,
    loss: 3770.132623076922, // it SOULD be deduct from earnings, but INTER does wrong. Result should be
  },
  {
    institutionId: institution.id,
    netEarning: 11392.121933333336,
    loss: 3770.132623076922,
  },
  {
    institutionId: institution.id,
    netEarning: 11392.121933333336,
    loss: 3770.132623076922,
  },
  {
    institutionId: institution.id,
    netEarning: 10190.121933333336,
    loss: 4972.132623076922,
  },
  {
    institutionId: institution.id,
    netEarning: 10190.121933333336,
    loss: 4972.132623076922,
  },
  {
    institutionId: institution.id,
    netEarning: 10190.121933333336,
    loss: 4972.132623076922,
  },
  {
    institutionId: institution.id,
    netEarning: 20178.656933333332,
    loss: 4972.132623076922,
  },
  { institutionId: institution.id, netEarning: 1721816.1419294872, loss: 0 },
  { institutionId: institution.id, netEarning: 1721816.1419294872, loss: 0 },
];

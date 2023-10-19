import Portfolio from '@domain/portfolio/Portfolio';

export const portfolios = [
  new Portfolio(0, 0),
  new Portfolio(0, 0),
  new Portfolio(45.499999999999886, 0),
  new Portfolio(45.499999999999886, 0),
  new Portfolio(45.499999999999886, 0),
  new Portfolio(45.499999999999886, 0),
  new Portfolio(15045.5, 0),
  new Portfolio(15045.5, 0),
  new Portfolio(15053.310256410256, 0),
  new Portfolio(11267.733333333334, 3785.576923076922),
  /* Postgres rounds differently from JavaScript,
  which leads to a variation in values.
  In JavaScript, the earnings calculation yields 11392.121933333332.
  However, when the calculation is performed within Postgres, we obtain a different result.*/
  new Portfolio(
    11392.121933333336,
    3770.132623076922, // it SOULD be deduct from earnings, but INTER does wrong. Result should be
  ),
  new Portfolio(11392.121933333336, 3770.132623076922),
  new Portfolio(11392.121933333336, 3770.132623076922),
  new Portfolio(10190.121933333336, 4972.132623076922),
  new Portfolio(10190.121933333336, 4972.132623076922),
  new Portfolio(10190.121933333336, 4972.132623076922),
  new Portfolio(20178.656933333332, 4972.132623076922),
  new Portfolio(1721816.1419294872, 0),
  new Portfolio(1721816.1419294872, 0),
];

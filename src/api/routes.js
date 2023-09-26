import { Router } from 'express';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import {
  institutionController,
  transactionController,
} from '../DependencyInjectionContainer.js';

const router = Router();

router.get('/healthy-check', (_, Response) =>
  Response.status(StatusCodes.OK).send(ReasonPhrases.OK),
);

router.get('/institution/:institutionId', (...args) =>
  institutionController.get(...args),
);

router.get('/institution/:institutionId/transaction/create', (...args) =>
  transactionController.create(...args),
);

/*
router.get('/accounts/:accountId', (req, res) => {
  const account = {
    id: '',
    accountName: '',
    totalLoss: '',
    totalWins: '',
    shares: [],
  };

  res.status(200).send(account);
});

router.get('/accounts/:accountId/situation/month', (req, res) => {
  const situation = {
    tradeYield: 1000,
    dividendYield: 1000,
    totalEarnings: 1000,
    totalLoss: 1000,
    tax: 100,
  };

  res.status(200).send(situation);
});

router.get('/accounts/:accountId/situation/previousMonth', (req, res) => {
  const situation = {
    tradeYield: 1000,
    dividendYield: 1000,
    totalEarnings: 1000,
    totalLoss: 1000,
    tax: 100,
  };

  res.status(200).send(situation);
});

router.get('/accounts/:accountId/situation/history', (req, res) => {
  const situation = [
    {
      tradeYield: 1000,
      dividendYield: 1000,
      totalEarnings: 1000,
      totalLoss: 1000,
      tax: 100,
    },
  ];

  res.status(200).send(situation);
});
*/

export default router;

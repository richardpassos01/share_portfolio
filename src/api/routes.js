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

router.get('/institution/:institutionId/profit', (...args) =>
  institutionController.profit(...args),
);

router.post('/transaction', (...args) => transactionController.create(...args));

export default router;

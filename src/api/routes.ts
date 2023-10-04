import * as Router from '@koa/router';

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import TransactionController from './transaction/TransactionController';

const router = new Router();

router.get('/healthy-check', (ctx) => {
  ctx.response.status = StatusCodes.OK;
  ctx.body = ReasonPhrases.OK;
});

// router.get('/institution/:institutionId', (...args) =>
//   institutionController.get(...args),
// );

// router.get('/institution/:institutionId/profit', (...args) =>
//   institutionController.profit(...args),
// );

// router.post('/transaction', (...args) => transactionController.create(...args));

router.post('/transaction', (ctx) => {
  const transactionController = container.get<TransactionController>(
    TYPES.TransactionController,
  );
  return transactionController.create(ctx);
});

// router.post(
//   '/authentication/authenticate',
//   async ctx => {
//     const authenticationController = container.get<AuthenticationController>(
//       TYPES.AuthenticationController
//     );
//     const result = await authenticationController.authenticate(ctx);
//     ctx.response.status = StatusCodes.OK;
//     ctx.body = result;
//   }
// );

export default router;

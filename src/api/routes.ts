import Router from '@koa/router';

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';

import TransactionController from './transaction/TransactionController';
import InstitutionController from './institution/InstitutionController';

import { bodyValidator } from '@middleware/schemaValidator';
import TransactionSchemas from './transaction/schemas/input/schema';
import InstitutionSchemas from './institution/schemas/input/schema';
import MonthlyBalanceController from './balance/monthlyBalance/MonthlyBalanceController';
import TotalBalanceController from './balance/totalBalance/TotalBalanceController';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ResyncController from './resync/ResyncController';

const router = new Router();

router.get('/healthy-check', (ctx) => {
  ctx.response.status = StatusCodes.OK;
  ctx.body = ReasonPhrases.OK;
});

router.post('/auth', (ctx) => {
  ctx.response.status = StatusCodes.OK;
  ctx.body = ReasonPhrases.OK;
});

router.get('/auth', (ctx) => {
  ctx.response.status = StatusCodes.OK;
  ctx.body = ReasonPhrases.OK;
});

router.post('/institution', bodyValidator(InstitutionSchemas.create), (ctx) => {
  const institutionController = container.get<InstitutionController>(
    TYPES.InstitutionController,
  );
  return institutionController.create(ctx);
});

router.get('/institutions/:userId', (ctx) => {
  const institutionController = container.get<InstitutionController>(
    TYPES.InstitutionController,
  );
  return institutionController.list(ctx);
});

router.get('/total-balance/:institutionId', (ctx) => {
  const totalBalanceController = container.get<TotalBalanceController>(
    TYPES.TotalBalanceController,
  );
  return totalBalanceController.get(ctx);
});

router.get('/monthly-balance/:institutionId', (ctx) => {
  const monthlyBalanceController = container.get<MonthlyBalanceController>(
    TYPES.MonthlyBalanceController,
  );
  return monthlyBalanceController.get(ctx);
});

router.get('/monthly-balances/:institutionId', (ctx) => {
  const monthlyBalanceController = container.get<MonthlyBalanceController>(
    TYPES.MonthlyBalanceController,
  );
  return monthlyBalanceController.list(ctx);
});

router.post('/resync/:institutionId', (ctx) => {
  const resyncController = container.get<ResyncController>(
    TYPES.ResyncController,
  );
  return resyncController.reSync(ctx);
});

router.get('/transactions/:institutionId', (ctx) => {
  const transactionController = container.get<TransactionController>(
    TYPES.TransactionController,
  );
  return transactionController.list(ctx);
});

router.post(
  '/transactions/:institutionId',
  bodyValidator(TransactionSchemas.create),
  (ctx) => {
    const transactionController = container.get<TransactionController>(
      TYPES.TransactionController,
    );
    return transactionController.create(ctx);
  },
);

router.delete(
  '/transactions/:institutionId',
  bodyValidator(TransactionSchemas.del),
  (ctx) => {
    const transactionController = container.get<TransactionController>(
      TYPES.TransactionController,
    );
    return transactionController.delete(ctx);
  },
);

export default router;

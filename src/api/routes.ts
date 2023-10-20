import Router from '@koa/router';

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';

import TransactionController from './transaction/TransactionController';
import InstitutionController from './institution/InstitutionController';

import schemaValidator from '@middleware/schemaValidator';
import TransactionSchemas from './transaction/schemas/input/schema';
import InstitutionSchemas from './institution/schemas/input/schema';
import PortfolioController from './portfolio/PortfolioController';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';

const router = new Router();

router.get('/healthy-check', (ctx) => {
  ctx.response.status = StatusCodes.OK;
  ctx.body = ReasonPhrases.OK;
});

router.post(
  '/institution',
  schemaValidator(InstitutionSchemas.create),
  (ctx) => {
    const institutionController = container.get<InstitutionController>(
      TYPES.InstitutionController,
    );
    return institutionController.create(ctx);
  },
);

router.get('/institution/:institutionId', (ctx) => {
  const institutionController = container.get<InstitutionController>(
    TYPES.InstitutionController,
  );
  return institutionController.get(ctx);
});

router.get('/portfolio/:institutionId', (ctx) => {
  const PortfolioController = container.get<PortfolioController>(
    TYPES.PortfolioController,
  );
  return PortfolioController.get(ctx);
});

router.post('/portfolio/:institutionId/re-sync', (ctx) => {
  const institutionController = container.get<InstitutionController>(
    TYPES.InstitutionController,
  );
  return institutionController.reSync(ctx);
});

router.post(
  '/transaction',
  schemaValidator(TransactionSchemas.create),
  (ctx) => {
    const transactionController = container.get<TransactionController>(
      TYPES.TransactionController,
    );
    return transactionController.create(ctx);
  },
);

router.delete(
  '/transaction',
  schemaValidator(TransactionSchemas.del),
  (ctx) => {
    const transactionController = container.get<TransactionController>(
      TYPES.TransactionController,
    );
    return transactionController.delete(ctx);
  },
);

export default router;

import Router from '@koa/router';

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import TransactionController from './transaction/TransactionController';
import InstitutionController from './institution/InstitutionController';

import schemaValidator from '@middleware/schemaValidator';
import TransactionSchemas from './transaction/schemas/input/schema';
import InstitutionSchemas from './institution/schemas/input/schema';
import FinancialReportController from './financialReport/FinancialReportController';

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

router.get('/financial_report/:institutionId/total-balance', (ctx) => {
  const financialReportController = container.get<FinancialReportController>(
    TYPES.FinancialReportController,
  );
  return financialReportController.get(ctx);
});

router.post(
  '/transaction',
  schemaValidator(TransactionSchemas.create),
  (ctx) => {
    const transactionController = container.get<TransactionController>(
      TYPES.TransactionController,
    );

    // will call SYNC in the end

    return transactionController.create(ctx);
  },
);

router.post(
  '/transaction/re-sync',

  // "removed_transactions": posso pegar a ultima data apagada, e apagar dados a partir desse momento.
  // Mas para isso, preciso criar varios registros de total balance
  // will delete  account items and recreate, get ordered transactions and do it
);

router.delete('/transaction', (ctx) => {
  const transactionController = container.get<TransactionController>(
    TYPES.TransactionController,
  );
  return transactionController.delete(ctx);
});

export default router;

import Koa from 'koa';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransactions from '@application/useCases/CreateTransactions';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import { CreateTransactionParams } from '@domain/shared/types';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransactions)
    private readonly createTransactions: CreateTransactions,

    @inject(TYPES.DeleteTransactions)
    private readonly deleteTransactions: DeleteTransactions,

    @inject(TYPES.ReSyncPortfolio)
    private readonly reSyncPortfolio: ReSyncPortfolio,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const payload: CreateTransactionParams[] = ctx.request.body;

    await this.createTransactions.execute(payload);

    ctx.response.status = StatusCodes.CREATED;
    ctx.response.body = ReasonPhrases.CREATED;
  }

  async delete(ctx: Koa.DefaultContext): Promise<void> {
    const { transactionIds, institutionId } = ctx.request.body;

    await this.deleteTransactions.execute(institutionId, transactionIds);
    await this.reSyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

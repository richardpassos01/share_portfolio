import Koa from 'koa';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransaction from '@application/useCases/CreateTransaction';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import { TransactionParams } from '@domain/shared/types';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransaction)
    private readonly createTransaction: CreateTransaction,

    @inject(TYPES.DeleteTransactions)
    private readonly deleteTransactions: DeleteTransactions,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const payload: TransactionParams[] = ctx.request.body;

    await this.createTransaction.execute(payload);

    ctx.response.status = StatusCodes.CREATED;
    ctx.response.body = ReasonPhrases.CREATED;
  }

  async delete(ctx: Koa.DefaultContext): Promise<void> {
    const ids = ctx.request.body;

    await this.deleteTransactions.execute(ids);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

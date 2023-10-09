import Koa from 'koa';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransactions from '@application/useCases/CreateTransactions';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import { TransactionParams } from '@domain/shared/types';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransactions)
    private readonly createTransactions: CreateTransactions,

    @inject(TYPES.DeleteTransactions)
    private readonly deleteTransactions: DeleteTransactions,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const payload: TransactionParams[] = ctx.request.body;

    await this.createTransactions.execute(payload);

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

import Koa from 'koa';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransactions from '@application/useCases/CreateTransactions';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import { CreateTransactionParams } from '@domain/shared/types';
import SyncPortfolio from '@application/useCases/SyncPortfolio';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransactions)
    private readonly createTransactions: CreateTransactions,

    @inject(TYPES.DeleteTransactions)
    private readonly deleteTransactions: DeleteTransactions,

    @inject(TYPES.SyncPortfolio)
    private readonly syncPortfolio: SyncPortfolio,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const payload: CreateTransactionParams[] = ctx.request.body;

    await this.createTransactions.execute(payload);

    //payload need to be
    //   { institutionID: 1234,
    //   transactions: []
    // }

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

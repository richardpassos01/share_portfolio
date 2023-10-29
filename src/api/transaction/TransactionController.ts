import Koa from 'koa';

import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransactions from '@application/useCases/CreateTransactions';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import { CreateTransactionParams } from '@domain/shared/types';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ListTransactions from '@application/queries/ListTransactions';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransactions)
    private readonly createTransactions: CreateTransactions,

    @inject(TYPES.DeleteTransactions)
    private readonly deleteTransactions: DeleteTransactions,

    @inject(TYPES.ReSyncPortfolio)
    private readonly reSyncPortfolio: ReSyncPortfolio,

    @inject(TYPES.ListTransactions)
    private readonly listTransactions: ListTransactions,
  ) {}

  async list(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;
    const { page, limit } = ctx.query;

    const result = await this.listTransactions.execute(
      institutionId,
      Number(page),
      Number(limit),
    );

    ctx.response.status = StatusCodes.OK;
    ctx.response.body = result;
  }

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const payload: CreateTransactionParams[] = ctx.request.body;
    const { institutionId } = ctx.params;

    await this.createTransactions.execute(institutionId, payload);

    ctx.response.status = StatusCodes.CREATED;
    ctx.response.body = ReasonPhrases.CREATED;
  }

  async delete(ctx: Koa.DefaultContext): Promise<void> {
    const transactionIds = ctx.request.body;
    const { institutionId } = ctx.params;

    await this.deleteTransactions.execute(institutionId, transactionIds);
    await this.reSyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
  }
}

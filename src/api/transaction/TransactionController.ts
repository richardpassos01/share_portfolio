import Koa from 'koa';

import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransactions from '@application/useCases/CreateTransactions';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import { CreateTransactionParams } from '@domain/shared/types';
import ResyncPortfolio from '@application/useCases/ResyncPortfolio';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ListTransactions from '@application/queries/ListTransactions';
import ListMonthYears from '@application/queries/ListMonthYears';
import { convertToUniqueArray } from '@helpers';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransactions)
    private readonly createTransactions: CreateTransactions,

    @inject(TYPES.DeleteTransactions)
    private readonly deleteTransactions: DeleteTransactions,

    @inject(TYPES.ResyncPortfolio)
    private readonly resyncPortfolio: ResyncPortfolio,

    @inject(TYPES.ListTransactions)
    private readonly listTransactions: ListTransactions,

    @inject(TYPES.ListMonthYears)
    private readonly listMonthYearsQuery: ListMonthYears,
  ) {}

  async list(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;
    const { order, page, limit, ticker, monthYear } = ctx.query;

    const pageNumber = page ? Number(page) : 1;
    const pageLimit = limit ? Number(limit) : 100;
    const tickers = convertToUniqueArray(ticker);
    const monthYears = convertToUniqueArray(monthYear);

    const result = await this.listTransactions.execute(
      institutionId,
      pageNumber,
      pageLimit,
      order,
      tickers,
      monthYears,
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
    await this.resyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
  }

  async listMonthYears(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const result = await this.listMonthYearsQuery.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.response.body = result;
  }
}

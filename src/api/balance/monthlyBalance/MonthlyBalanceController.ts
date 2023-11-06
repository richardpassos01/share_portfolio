import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { StatusCodes } from '@domain/shared/enums';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import ListMonthlyBalance from '@application/queries/ListMonthlyBalance';

@injectable()
export default class MonthlyBalanceController {
  constructor(
    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.ListMonthlyBalance)
    private readonly listMonthlyBalance: ListMonthlyBalance,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { yearMonth } = ctx.request.body;
    const { institutionId } = ctx.params;

    const balance = await this.getMonthlyBalance.execute(
      institutionId,
      new Date(yearMonth),
    );

    ctx.response.status = StatusCodes.OK;
    ctx.response.body = balance;
  }

  async list(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;
    const { limit } = ctx.query;

    const balances = await this.listMonthlyBalance.execute(
      institutionId,
      limit,
    );

    ctx.response.status = StatusCodes.OK;
    ctx.response.body = balances;
  }
}

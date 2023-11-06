import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ResyncPortfolio from '@application/useCases/ResyncPortfolio';
import GetTotalBalance from '@application/queries/GetTotalBalance';

@injectable()
export default class BalanceController {
  constructor(
    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,

    @inject(TYPES.ResyncPortfolio)
    private readonly resyncPortfolio: ResyncPortfolio,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.getTotalBalance.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }

  async listMonthlyBalances(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    await this.resyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

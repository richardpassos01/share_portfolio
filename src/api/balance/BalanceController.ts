import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';
import GetTotalBalance from '@application/queries/GetTotalBalance';

@injectable()
export default class BalanceController {
  constructor(
    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,

    @inject(TYPES.ReSyncPortfolio)
    private readonly reSyncPortfolio: ReSyncPortfolio,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.getTotalBalance.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }

  async reSync(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    await this.reSyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }

  async listMonthlyBalances(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    await this.reSyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

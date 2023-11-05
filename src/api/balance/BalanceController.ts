import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';

@injectable()
export default class PortfolioController {
  constructor(
    @inject(TYPES.ReSyncPortfolio)
    private readonly reSyncPortfolio: ReSyncPortfolio,
  ) {}

  async getTotalBalance(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.createPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }

  async reSyncBalances(ctx: Koa.DefaultContext): Promise<void> {
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

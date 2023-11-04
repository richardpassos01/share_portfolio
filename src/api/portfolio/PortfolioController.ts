import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import CreatePortfolio from '@application/useCases/CreatePortfolio';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';

@injectable()
export default class PortfolioController {
  constructor(
    @inject(TYPES.CreatePortfolio)
    private readonly createPortfolio: CreatePortfolio,

    @inject(TYPES.ReSyncPortfolio)
    private readonly reSyncPortfolio: ReSyncPortfolio,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.createPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }

  async reSync(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    await this.reSyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

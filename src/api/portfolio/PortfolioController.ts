import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import CreatePortfolio from '@application/useCases/CreatePortfolio';
import { StatusCodes } from '@domain/shared/enums';

@injectable()
export default class PortfolioController {
  constructor(
    @inject(TYPES.CreatePortfolio)
    private readonly createPortfolio: CreatePortfolio,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.createPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }
}

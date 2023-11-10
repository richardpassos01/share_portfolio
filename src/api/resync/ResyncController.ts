import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ResyncPortfolio from '@application/useCases/ResyncPortfolio';

@injectable()
export default class ResyncController {
  constructor(
    @inject(TYPES.ResyncPortfolio)
    private readonly resyncPortfolio: ResyncPortfolio,
  ) {}

  async reSync(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    await this.resyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

import Koa from 'koa';

import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import { StatusCodes } from '@domain/shared/enums';
import ListShares from '@application/queries/ListShares';

@injectable()
export default class ShareController {
  constructor(
    @inject(TYPES.ListShares)
    private readonly listShares: ListShares,
  ) {}

  async list(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const result = await this.listShares.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.response.body = result;
  }
}

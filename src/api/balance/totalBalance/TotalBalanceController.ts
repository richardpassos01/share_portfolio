import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import { StatusCodes } from '@domain/shared/enums';
import GetTotalBalance from '@application/queries/GetTotalBalance';

@injectable()
export default class TotalBalanceController {
  constructor(
    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.getTotalBalance.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }
}

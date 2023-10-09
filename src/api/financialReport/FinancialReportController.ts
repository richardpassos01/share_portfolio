import Koa from 'koa';

import { TYPES } from '@constants/types';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import GetTotalBalance from '@application/queries/GetTotalBalance';

@injectable()
export default class FinancialReportController {
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

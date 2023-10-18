import Koa from 'koa';

import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import CalculateTotalBalanceEarning from '@application/useCases/CalculateTotalBalanceEarning';
import { StatusCodes } from '@domain/shared/enums';

@injectable()
export default class FinancialReportController {
  constructor(
    @inject(TYPES.CalculateTotalBalanceEarning)
    private readonly calculateTotalBalanceEarning: CalculateTotalBalanceEarning,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance =
      await this.calculateTotalBalanceEarning.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }
}

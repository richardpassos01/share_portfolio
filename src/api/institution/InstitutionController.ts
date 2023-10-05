import * as Koa from 'koa';

import { TYPES } from '@constants/types';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import GetInstitution from '@application/useCases/GetInstitution';
import GetProfit from '@application/useCases/GetProfit';

@injectable()
export default class InstitutionController {
  constructor(
    @inject(TYPES.GetInstitution)
    private readonly getInstitution: GetInstitution,

    @inject(TYPES.GetProfit)
    private readonly getProfit: GetProfit,
  ) {}

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const institution = await this.getInstitution.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = institution;
  }

  async profit(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const profit = await this.getProfit.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = profit;
  }
}

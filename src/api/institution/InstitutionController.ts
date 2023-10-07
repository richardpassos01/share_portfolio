import Koa from 'koa';

import { TYPES } from '@constants/types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import GetInstitution from '@application/useCases/GetInstitution';
import GetInstitutionBalance from '@application/useCases/GetInstitutionBalance';
import CreateInstitution from '@application/useCases/CreateInstitution';

@injectable()
export default class InstitutionController {
  constructor(
    @inject(TYPES.CreateInstitution)
    private readonly createInstitution: CreateInstitution,

    @inject(TYPES.GetInstitution)
    private readonly getInstitution: GetInstitution,

    @inject(TYPES.GetInstitutionBalance)
    private readonly getInstitutionBalance: GetInstitutionBalance,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const { name, userId } = ctx.request.body;

    await this.createInstitution.execute(name, userId);

    ctx.response.status = StatusCodes.CREATED;
    ctx.response.body = ReasonPhrases.CREATED;
  }

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const institution = await this.getInstitution.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = institution;
  }

  async getBalance(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = await this.getInstitutionBalance.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }
}

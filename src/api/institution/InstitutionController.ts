import Koa from 'koa';

import { TYPES } from '@constants/types';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import GetInstitution from '@application/queries/GetInstitution';
import CreateInstitution from '@application/useCases/CreateInstitution';

@injectable()
export default class InstitutionController {
  constructor(
    @inject(TYPES.CreateInstitution)
    private readonly createInstitution: CreateInstitution,

    @inject(TYPES.GetInstitution)
    private readonly getInstitution: GetInstitution,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<any> {
    const { name, userId } = ctx.request.body;

    const institutionId = await this.createInstitution.execute(name, userId);

    ctx.response.status = StatusCodes.CREATED;
    ctx.response.body = institutionId;
  }

  async get(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const institution = await this.getInstitution.execute(institutionId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = institution;
  }

  async getBalance(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    const balance = 1;

    ctx.response.status = StatusCodes.OK;
    ctx.body = balance;
  }
}

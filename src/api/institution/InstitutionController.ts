import Koa from 'koa';

import { TYPES } from '@constants/types';
import { StatusCodes } from '@domain/shared/enums';
import { injectable, inject } from 'inversify';
import ListInstitutions from '@application/queries/ListInstitutions';
import CreateInstitution from '@application/useCases/CreateInstitution';

@injectable()
export default class InstitutionController {
  constructor(
    @inject(TYPES.CreateInstitution)
    private readonly createInstitution: CreateInstitution,

    @inject(TYPES.ListInstitutions)
    private readonly listInstitutions: ListInstitutions,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const { name, userId } = ctx.request.body;

    const institutionId = await this.createInstitution.execute(name, userId);

    ctx.response.status = StatusCodes.CREATED;
    ctx.response.body = institutionId;
  }

  async list(ctx: Koa.DefaultContext): Promise<void> {
    const { userId } = ctx.params;

    const institution = await this.listInstitutions.execute(userId);

    ctx.response.status = StatusCodes.OK;
    ctx.body = institution;
  }
}

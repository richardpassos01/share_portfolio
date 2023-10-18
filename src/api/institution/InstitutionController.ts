import Koa from 'koa';

import { TYPES } from '@constants/types';
import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import { injectable, inject } from 'inversify';
import GetInstitution from '@application/queries/GetInstitution';
import CreateInstitution from '@application/useCases/CreateInstitution';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';

@injectable()
export default class InstitutionController {
  constructor(
    @inject(TYPES.CreateInstitution)
    private readonly createInstitution: CreateInstitution,

    @inject(TYPES.GetInstitution)
    private readonly getInstitution: GetInstitution,

    @inject(TYPES.ReSyncPortfolio)
    private readonly reSyncPortfolio: ReSyncPortfolio,
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

  async reSync(ctx: Koa.DefaultContext): Promise<void> {
    const { institutionId } = ctx.params;

    await this.reSyncPortfolio.execute(institutionId);

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.response.body = ReasonPhrases.NO_CONTENT;
  }
}

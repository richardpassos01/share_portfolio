import * as Koa from 'koa';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { dateStringToDate } from '../../helpers/Helpers';
import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import { AbstractUseCase, TransactionParams } from '@domain/shared/interfaces';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransaction)
    private readonly createTransaction: AbstractUseCase<
      TransactionParams,
      void
    >,
  ) {}

  async create(ctx: Koa.DefaultContext): Promise<void> {
    const {
      institutionId,
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalCost,
    } = ctx.request.body;

    await this.createTransaction.execute({
      institutionId,
      type,
      date: dateStringToDate(date),
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalCost,
    });

    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.body = ReasonPhrases.NO_CONTENT;
  }
}

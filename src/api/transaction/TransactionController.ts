import Koa from 'koa';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { dateStringToDate } from '../../helpers';
import { TYPES } from '@constants/types';
import { inject, injectable } from 'inversify';
import CreateTransaction from '@application/useCases/CreateTransaction';

@injectable()
export default class TransactionController {
  constructor(
    @inject(TYPES.CreateTransaction)
    private readonly createTransaction: CreateTransaction,
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

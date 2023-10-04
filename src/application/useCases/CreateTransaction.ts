import { AbstractUseCase } from '@domain/shared/interfaces';
import Transaction from '../../domain/transaction/Transaction';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import UpdatePortfolio from './UpdatePortfolio';
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '@domain/shared/constants';

export interface TransactionParams {
  institutionId: string;
  type: TRANSACTION_TYPE;
  date: Date;
  category: TRANSACTION_CATEGORY;
  ticketSymbol: string;
  quantity: number;
  unityPrice: number;
  totalCost: number;
}

@injectable()
export default class CreateTransaction
  implements AbstractUseCase<TransactionParams, void>
{
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,

    @inject(TYPES.UpdatePortfolio)
    private readonly updatePortfolio: UpdatePortfolio,
  ) {}

  async execute(params: TransactionParams) {
    const transaction = new Transaction(
      params.institutionId,
      params.type,
      params.date,
      params.category,
      params.ticketSymbol,
      params.quantity,
      params.unityPrice,
      params.totalCost,
    );

    await this.transactionRepository.create(transaction);
    return this.updatePortfolio.execute(transaction);
  }
}

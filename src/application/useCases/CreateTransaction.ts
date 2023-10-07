import Transaction from '../../domain/transaction/Transaction';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import UpdatePortfolio from './UpdatePortfolio';
import { TransactionParams } from '@domain/shared/types';

@injectable()
export default class CreateTransaction {
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

import Transaction from '../../domain/transaction/Transaction';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { CreateTransactionParams } from '@domain/shared/types';
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { dateStringToDate } from '@helpers';
import UpdatePortfolio from './UpdatePortfolio';

@injectable()
export default class CreateTransactions {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,

    @inject(TYPES.UpdatePortfolio)
    private readonly updatePortfolio: UpdatePortfolio,
  ) {}

  async execute(params: CreateTransactionParams[]): Promise<void> {
    const transactions = params
      .map(
        (param) =>
          new Transaction(
            param.institutionId,
            TRANSACTION_TYPE[param.type],
            dateStringToDate(param.date),
            TRANSACTION_CATEGORY[param.category],
            param.ticketSymbol,
            param.quantity,
            param.unityPrice,
            param.totalCost,
          ),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    await this.transactionRepository.createMany(transactions);
    await this.updatePortfolio.execute(transactions);
  }
}

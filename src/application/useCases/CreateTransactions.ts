import Transaction from '../../domain/transaction/Transaction';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { CreateTransactionParams, TransactionDTO } from '@domain/shared/types';
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

  async execute(
    institutionId: string,
    params: CreateTransactionParams[],
  ): Promise<void> {
    const transactions = params
      .map(
        (param) =>
          new Transaction(
            institutionId,
            TRANSACTION_TYPE[param.type],
            dateStringToDate(param.date),
            TRANSACTION_CATEGORY[param.category],
            param.ticketSymbol,
            param.quantity,
            param.unitPrice,
            param.totalCost,
          ),
      )
      .sort(this.sortTransactions);

    await this.transactionRepository.createMany(transactions);

    for (const transaction of transactions) {
      await this.updatePortfolio.execute(transaction);
    }
  }

  sortTransactions(a: TransactionDTO, b: TransactionDTO): number {
    const dataComparison = a.date.getTime() - b.date.getTime();
    if (dataComparison !== 0) return dataComparison;

    const typeComparison = a.type.localeCompare(b.type);
    if (typeComparison !== 0) return typeComparison;

    return a.ticketSymbol.localeCompare(b.ticketSymbol);
  }
}

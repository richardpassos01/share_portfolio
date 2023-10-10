import Transaction from '../../domain/transaction/Transaction';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { CreateTransactionParams } from '@domain/shared/types';
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { dateStringToDate } from '@helpers';

@injectable()
export default class SyncPortfolio {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<void> {
    const transactions = await this.transactionRepository.list(institutionId);

    console.log(transactions);
    // for (const transaction of transactions) {
    //   await this.updatePortfolio.execute(transaction);
    // }

    // let
  }
}

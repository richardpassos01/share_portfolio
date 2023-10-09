import { TYPES } from '@constants/types';
import { TRANSACTION_TYPE } from '@domain/shared/enums';
import { AbstractTransaction } from '@domain/shared/interfaces';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { injectable, inject } from 'inversify';

type TradeTransactions = [AbstractTransaction[], AbstractTransaction[]];

@injectable()
export default class ListTradeTransactionsFromMonth {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute({
    institutionId,
    date,
  }: AbstractTransaction): Promise<TradeTransactions> {
    const monthTransactions = await this.transactionRepository.listFromMonth(
      institutionId,
      date,
    );

    const buyTransactions = this.filterTransactionByType(
      monthTransactions,
      TRANSACTION_TYPE.BUY,
    );
    const sellTransactions = this.filterTransactionByType(
      monthTransactions,
      TRANSACTION_TYPE.SELL,
    );

    return [buyTransactions, sellTransactions];
  }

  filterTransactionByType(
    transactions: AbstractTransaction[],
    type: TRANSACTION_TYPE,
  ) {
    return transactions.filter((transaction) => transaction.type === type);
  }
}

import { TRANSACTION_TYPE } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import ProcessBuyTransaction from './ProcessBuyTransaction';
import ProcessSellTransaction from './ProcessSellTransaction';
import BalanceManagement from '@domain/portfolio/BalanceManagement';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class ProcessTradeTransaction {
  constructor(
    @inject(TYPES.ProcessBuyTransaction)
    private readonly processBuyTransaction: ProcessBuyTransaction,

    @inject(TYPES.ProcessSellTransaction)
    private readonly processSellTransaction: ProcessSellTransaction,
  ) {}

  async execute(
    transaction: TransactionDTO,
    balanceManagement: BalanceManagement,
  ): Promise<void> {
    const isBuyTransaction = transaction.type === TRANSACTION_TYPE.BUY;

    if (isBuyTransaction) {
      return this.processBuyTransaction.execute(transaction);
    }

    return this.processSellTransaction.execute(transaction, balanceManagement);
  }
}

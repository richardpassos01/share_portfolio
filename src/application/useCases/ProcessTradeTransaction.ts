import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import ProcessBuyTransaction from './ProcessBuyTransaction';
import ProcessSellTransaction from './ProcessSellTransaction';

@injectable()
export default class ProcessTradeTransaction {
  constructor(
    @inject(TYPES.ProcessBuyTransaction)
    private readonly processBuyTransaction: ProcessBuyTransaction,

    @inject(TYPES.ProcessSellTransaction)
    private readonly processSellTransaction: ProcessSellTransaction,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const isBuyTransaction = transaction.getType() === TRANSACTION_TYPE.BUY;

    if (isBuyTransaction) {
      return this.processBuyTransaction.execute(transaction);
    }

    return this.processSellTransaction.execute(transaction);
  }
}

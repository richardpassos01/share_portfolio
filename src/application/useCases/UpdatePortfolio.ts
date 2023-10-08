import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import ProcessDividendTransaction from './ProcessDividendTransaction';
import ProcessSpecialEventsOnShare from './ProcessSpecialEventsOnShare';
import ProcessBuyTransaction from './ProcessBuyTransaction';
import ProcessSellTransaction from './ProcessSellTransaction';

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.ProcessDividendTransaction)
    private readonly processDividendTransaction: ProcessDividendTransaction,

    @inject(TYPES.ProcessSpecialEventsOnShare)
    private readonly processSpecialEventsOnShare: ProcessSpecialEventsOnShare,

    @inject(TYPES.ProcessBuyTransaction)
    private readonly processBuyTransaction: ProcessBuyTransaction,

    @inject(TYPES.ProcessSellTransaction)
    private readonly processSellTransaction: ProcessSellTransaction,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    try {
      if (transaction.getCategory() === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.processDividendTransaction.execute(transaction);
      }

      if (
        transaction.getCategory() === TRANSACTION_CATEGORY.SPLIT ||
        transaction.getCategory() === TRANSACTION_CATEGORY.BONUS_SHARE
      ) {
        return this.processSpecialEventsOnShare.execute(transaction);
      }

      if (transaction.getCategory() === TRANSACTION_CATEGORY.TRADE) {
        if (transaction.getType() === TRANSACTION_TYPE.BUY) {
          return this.processBuyTransaction.execute(transaction);
        }

        if (transaction.getType() === TRANSACTION_TYPE.SELL) {
          return this.processSellTransaction.execute(transaction);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

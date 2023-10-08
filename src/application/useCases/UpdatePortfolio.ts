import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import ProcessDividendTransaction from './ProcessDividendTransaction';
import ProcessSpecialEventsOnShare from './ProcessSpecialEventsOnShare';
import ProcessTradeTransaction from './ProcessTradeTransaction';

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.ProcessDividendTransaction)
    private readonly processDividendTransaction: ProcessDividendTransaction,

    @inject(TYPES.ProcessSpecialEventsOnShare)
    private readonly processSpecialEventsOnShare: ProcessSpecialEventsOnShare,

    @inject(TYPES.ProcessTradeTransaction)
    private readonly processTradeTransaction: ProcessTradeTransaction,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<any> {
    try {
      const isDividend =
        transaction.getCategory() === TRANSACTION_CATEGORY.DIVIDENDS;

      const isSpecialEvent =
        transaction.getCategory() === TRANSACTION_CATEGORY.SPLIT ||
        transaction.getCategory() === TRANSACTION_CATEGORY.BONUS_SHARE;

      const isTrade = transaction.getCategory() === TRANSACTION_CATEGORY.TRADE;

      if (isDividend) {
        return this.processDividendTransaction.execute(transaction);
      }

      if (isSpecialEvent) {
        return this.processSpecialEventsOnShare.execute(transaction);
      }

      if (isTrade) {
        return this.processTradeTransaction.execute(transaction);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import ProcessBuyTransaction from './ProcessBuyTransaction';
import ProcessSellTransaction from './ProcessSellTransaction';
import FinancialReport from '@domain/financialReport/FinancialReport';
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
    financialReport: FinancialReport,
    monthlyTransactions?: TransactionDTO[],
  ): Promise<void> {
    const isBuyTransaction = transaction.type === TRANSACTION_TYPE.BUY;

    if (isBuyTransaction) {
      return this.processBuyTransaction.execute(transaction);
    }

    return this.processSellTransaction.execute(
      transaction,
      financialReport,
      monthlyTransactions,
    );
  }
}

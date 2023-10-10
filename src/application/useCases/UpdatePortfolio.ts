import { TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import ProcessDividendTransaction from './ProcessDividendTransaction';
import ProcessSpecialEventsOnShare from './ProcessSpecialEventsOnShare';
import ProcessTradeTransaction from './ProcessTradeTransaction';
import CreateFinancialReportFromBalances from './CreateFinancialReportFromBalances';
import UpdateBalancesFromFinancialReport from './UpdateBalancesFromFinancialReport';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.ProcessDividendTransaction)
    private readonly processDividendTransaction: ProcessDividendTransaction,

    @inject(TYPES.ProcessSpecialEventsOnShare)
    private readonly processSpecialEventsOnShare: ProcessSpecialEventsOnShare,

    @inject(TYPES.ProcessTradeTransaction)
    private readonly processTradeTransaction: ProcessTradeTransaction,

    @inject(TYPES.CreateFinancialReportFromBalances)
    private readonly createFinancialReportFromBalances: CreateFinancialReportFromBalances,

    @inject(TYPES.UpdateBalancesFromFinancialReport)
    private readonly updateBalancesFromFinancialReport: UpdateBalancesFromFinancialReport,
  ) {}

  async execute(transactions: TransactionDTO[]): Promise<any> {
    for (const transaction of transactions) {
      const financialReport =
        await this.createFinancialReportFromBalances.execute(transaction);

      const isDividend =
        transaction.category === TRANSACTION_CATEGORY.DIVIDENDS;

      const isSpecialEvent =
        transaction.category === TRANSACTION_CATEGORY.SPLIT ||
        transaction.category === TRANSACTION_CATEGORY.BONUS_SHARE;

      const isTrade = transaction.category === TRANSACTION_CATEGORY.TRADE;

      if (isDividend) {
        await this.processDividendTransaction.execute(
          transaction,
          financialReport,
        );
      }

      if (isSpecialEvent) {
        await this.processSpecialEventsOnShare.execute(transaction);
      }

      if (isTrade) {
        await this.processTradeTransaction.execute(
          transaction,
          financialReport,
        );
      }

      return this.updateBalancesFromFinancialReport.execute(
        financialReport,
        transaction,
      );
    }
  }
}

import { TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import ProcessDividendTransaction from './ProcessDividendTransaction';
import ProcessSpecialEventsOnShare from './ProcessSpecialEventsOnShare';
import ProcessTradeTransaction from './ProcessTradeTransaction';
import UpdateBalances from './UpdateBalances';
import { TransactionDTO } from '@domain/shared/types';
import BalanceManagementFactory from '@domain/balance/BalanceManagementFactory';

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.ProcessDividendTransaction)
    private readonly processDividendTransaction: ProcessDividendTransaction,

    @inject(TYPES.ProcessSpecialEventsOnShare)
    private readonly processSpecialEventsOnShare: ProcessSpecialEventsOnShare,

    @inject(TYPES.ProcessTradeTransaction)
    private readonly processTradeTransaction: ProcessTradeTransaction,

    @inject(TYPES.UpdateBalances)
    private readonly updateBalances: UpdateBalances,

    @inject(TYPES.BalanceManagementFactory)
    private readonly balanceManagementFactory: BalanceManagementFactory,
  ) {}

  async execute(transaction: TransactionDTO): Promise<void> {
    const balanceManagement = await this.balanceManagementFactory.build(
      transaction.institutionId,
      transaction.date,
    );

    const isDividend = transaction.category === TRANSACTION_CATEGORY.DIVIDENDS;

    const isSpecialEvent =
      transaction.category === TRANSACTION_CATEGORY.SPLIT ||
      transaction.category === TRANSACTION_CATEGORY.BONUS_SHARE;

    const isTrade = transaction.category === TRANSACTION_CATEGORY.TRADE;

    if (isDividend) {
      await this.processDividendTransaction.execute(
        transaction,
        balanceManagement,
      );
    }

    if (isSpecialEvent) {
      await this.processSpecialEventsOnShare.execute(transaction);
    }

    if (isTrade) {
      await this.processTradeTransaction.execute(
        transaction,
        balanceManagement,
      );
    }

    await this.updateBalances.execute(balanceManagement, transaction);
  }
}

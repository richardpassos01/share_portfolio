import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import UpdateBalances from './UpdateBalances';
import { TransactionDTO } from '@domain/shared/types';
import BalanceManagementFactory from '@domain/balance/BalanceManagementFactory';
import GetShare from '@application/queries/GetShare';
import CreateShare from './CreateShare';
import BalanceManagement from '@domain/balance/BalanceManagement';
import ListTradeTransactionsFromMonth from './ListTradeTransactionsFromMonth';
import Share from '@domain/share/Share';
import UpdateShare from './UpdateShare';

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.UpdateBalances)
    private readonly updateBalances: UpdateBalances,

    @inject(TYPES.BalanceManagementFactory)
    private readonly balanceManagementFactory: BalanceManagementFactory,

    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.ListTradeTransactionsFromMonth)
    private readonly listTradeTransactionsFromMonth: ListTradeTransactionsFromMonth,

    @inject(TYPES.CreateShare)
    private readonly createShare: CreateShare,

    @inject(TYPES.UpdateShare)
    private readonly updateShare: UpdateShare,
  ) {}

  async execute(transaction: TransactionDTO): Promise<void> {
    const balanceManagement = await this.balanceManagementFactory.build(
      transaction.institutionId,
      transaction.date,
    );
    const share = await this.getShare.execute(transaction);

    if (!share) {
      await this.createShare.execute(transaction);
      return this.updateBalances.execute(balanceManagement, transaction);
    }

    if (transaction.category === TRANSACTION_CATEGORY.DIVIDENDS) {
      balanceManagement.setDividendEarning(transaction.totalCost);
    }

    if (transaction.type === TRANSACTION_TYPE.SELL) {
      await this.processSellOperation(transaction, balanceManagement, share);
    }

    await this.updateShare.execute(share, transaction);
    await this.updateBalances.execute(balanceManagement, transaction);
  }

  async processSellOperation(
    transaction: TransactionDTO,
    balanceManagement: BalanceManagement,
    share: Share,
  ) {
    const earningOrLoss = share.getEarningOrLoss(transaction);

    const [buyTransactions, sellTransactions] =
      await this.listTradeTransactionsFromMonth.execute(transaction);

    const monthlySales = sellTransactions.reduce(
      (acc, sellTransaction) => acc + sellTransaction.totalCost,
      0,
    );

    balanceManagement.setType(buyTransactions, sellTransactions);
    balanceManagement.handleSellOperation(monthlySales, earningOrLoss);
  }
}

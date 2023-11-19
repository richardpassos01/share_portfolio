import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import UpdateBalances from './UpdateBalances';
import { TransactionDTO } from '@domain/shared/types';
import BalanceManagementFactory from '@domain/balance/BalanceManagementFactory';
import GetShare from '@application/queries/GetShare';
import CreateShare from './CreateShare';
import BalanceManagement from '@domain/balance/BalanceManagement';
import Share from '@domain/share/Share';
import UpdateShare from './UpdateShare';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';

@injectable()
export default class UpdatePortfolio {
  constructor(
    @inject(TYPES.UpdateBalances)
    private readonly updateBalances: UpdateBalances,

    @inject(TYPES.BalanceManagementFactory)
    private readonly balanceManagementFactory: BalanceManagementFactory,

    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.CreateShare)
    private readonly createShare: CreateShare,

    @inject(TYPES.UpdateShare)
    private readonly updateShare: UpdateShare,

    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(transaction: TransactionDTO): Promise<void> {
    if (transaction.category === TRANSACTION_CATEGORY.OTHER) return;

    const balanceManagement = await this.balanceManagementFactory.build(
      transaction.institutionId,
      transaction.date,
    );

    if (transaction.category === TRANSACTION_CATEGORY.DIVIDENDS) {
      balanceManagement.setDividendEarning(transaction.totalCost);
      return this.updateBalances.execute(balanceManagement, transaction);
    }

    const share = await this.getShare.execute(transaction);

    if (!share && transaction.category === TRANSACTION_CATEGORY.TRADE) {
      await this.createShare.execute(transaction);
      return this.updateBalances.execute(balanceManagement, transaction);
    }

    if (transaction.type === TRANSACTION_TYPE.SELL) {
      await this.processSellOperation(
        transaction,
        balanceManagement,
        share as Share,
      );
    }

    await Promise.all([
      this.updateShare.execute(share as Share, transaction),
      this.updateBalances.execute(balanceManagement, transaction),
    ]);
  }

  async processSellOperation(
    transaction: TransactionDTO,
    balanceManagement: BalanceManagement,
    share: Share,
  ) {
    const earningOrLoss = share.getEarningOrLoss(transaction);

    const tradeTransactions =
      await this.transactionRepository.listTradesFromSameMonth(transaction);

    const buyTransactions = this.filterTransactionByType(
      tradeTransactions,
      TRANSACTION_TYPE.BUY,
    );
    const sellTransactions = this.filterTransactionByType(
      tradeTransactions,
      TRANSACTION_TYPE.SELL,
    );

    const monthlySales = sellTransactions.reduce(
      (acc, sellTransaction) => acc + sellTransaction.totalCost,
      0,
    );

    balanceManagement.setTotalSold(monthlySales);
    balanceManagement.setCurrentMonthlyTotslLoss(balanceManagement.totalLoss);
    balanceManagement.setType(buyTransactions, sellTransactions);
    balanceManagement.handleSellOperation(monthlySales, earningOrLoss);
  }

  filterTransactionByType(
    transactions: TransactionDTO[],
    type: TRANSACTION_TYPE,
  ) {
    return transactions.filter((transaction) => transaction.type === type);
  }
}

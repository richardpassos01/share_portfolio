import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import UpdateBalances from './UpdateBalances';
import BalanceManagementFactory from '@domain/balance/BalanceManagementFactory';
import GetShare from '@application/queries/GetShare';
import CreateShare from './CreateShare';
import BalanceManagement from '@domain/balance/BalanceManagement';
import Share from '@domain/share/Share';
import UpdateShare from './UpdateShare';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import Transaction from '@domain/transaction/Transaction';
import { dateToMonthYear } from '@helpers';

const groupedByDate = (transactions: Transaction[]) =>
  transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
    const dateKey = transaction.date.toISOString().split('T')[0];

    if (transaction.category !== TRANSACTION_CATEGORY.OTHER) {
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(transaction);
    }
    return acc;
  }, {});

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

  async execute(transactions: Transaction[]): Promise<void> {
    const orders = groupedByDate(transactions);
    const institutionId = transactions[0].institutionId;

    for (const key of Object.keys(orders)) {
      const order = orders[key];
      const targetDate = order[0].date;
      const targetMonthYear = dateToMonthYear(targetDate);

      const balanceManagement = await this.balanceManagementFactory.build(
        institutionId,
        targetDate,
      );

      const dividendsTransactions = this.filterTransactionByType(
        order,
        TRANSACTION_TYPE.BUY,
        TRANSACTION_CATEGORY.DIVIDENDS,
      );

      const buyTransactions = this.filterTransactionByType(
        order,
        TRANSACTION_TYPE.BUY,
        TRANSACTION_CATEGORY.TRADE,
      );

      const sellTransactions = this.filterTransactionByType(
        order,
        TRANSACTION_TYPE.SELL,
        TRANSACTION_CATEGORY.TRADE,
      );

      const bonusShareTransactions = this.filterTransactionByType(
        order,
        TRANSACTION_TYPE.BUY,
        TRANSACTION_CATEGORY.BONUS_SHARE,
      );

      const splitTransactions = this.filterTransactionByType(
        order,
        TRANSACTION_TYPE.BUY,
        TRANSACTION_CATEGORY.SPLIT,
      );

      const specialEventsTransactions = [
        ...bonusShareTransactions,
        ...splitTransactions,
      ];

      if (dividendsTransactions.length > 0) {
        const dividendsAmount = this.calculateTotalCostOfTransactions(
          dividendsTransactions,
        );
        balanceManagement.setDividendEarning(dividendsAmount);
      }

      if (specialEventsTransactions.length > 0) {
        for (const transaction of specialEventsTransactions) {
          const share = await this.getShare.execute(transaction);
          await this.updateShare.execute(share as Share, transaction);
        }
      }

      if (buyTransactions.length > 0) {
        for (const transaction of buyTransactions) {
          const share = await this.getShare.execute(transaction);

          if (!share) {
            await this.createShare.execute(transaction);
          } else {
            await this.updateShare.execute(share as Share, transaction);
          }
        }
      }

      if (sellTransactions.length > 0) {
        await this.processSellOperation(
          order,
          balanceManagement,
          sellTransactions,
        );
      }

      await Promise.all([
        this.updateBalances.execute(
          balanceManagement,
          targetMonthYear,
          institutionId,
        ),
      ]);
    }
  }

  async processSellOperation(
    order: Transaction[],
    balanceManagement: BalanceManagement,
    sellTransactions: Transaction[],
  ) {
    const hasDayTrade =
      await this.transactionRepository.checkIfHasDayTradeOnSameMonth(
        order[0].date,
      );

    const orderTotalSales = this.calculateTotalCostOfOrder(order);
    balanceManagement.setMonthlyTotalSold(orderTotalSales);

    let earningOrLossOnOrder = 0;

    for (const transaction of sellTransactions) {
      const share = (await this.getShare.execute(transaction)) as Share;

      earningOrLossOnOrder += share.getEarningOrLoss(transaction);

      await this.updateShare.execute(share, transaction);
    }

    balanceManagement.handleSellOperation(earningOrLossOnOrder, hasDayTrade);
  }

  filterTransactionByType(
    transactions: Transaction[],
    type: TRANSACTION_TYPE,
    category: TRANSACTION_CATEGORY,
  ) {
    return transactions.filter(
      (transaction) =>
        transaction.type === type && transaction.category === category,
    );
  }

  calculateTotalCostOfOrder(transactions: any) {
    const result = transactions.reduce((acc: any, transaction: any) => {
      if (transaction.type === 'BUY') {
        return acc + transaction.totalCost;
      }
      return acc - transaction.totalCost;
    }, 0);

    const totalDeductionFromOrderSales = result > 0 ? 0 : Math.abs(result);
    return totalDeductionFromOrderSales;
  }

  calculateTotalCostOfTransactions(transactions: Transaction[]) {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.totalCost;
    }, 0);
  }
}

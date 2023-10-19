import { TYPES } from '@constants/types';
import { TransactionDTO } from '@domain/shared/types';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateOrLiquidateShare from './UpdateOrLiquidateShare';
import ListTradeTransactionsFromMonth from './ListTradeTransactionsFromMonth';
import BalanceManagement from '@domain/portfolio/BalanceManagement';
import NotFoundError from '@domain/shared/error/NotFoundError';
import { ReasonPhrases } from '@domain/shared/enums';

@injectable()
export default class ProcessSellTransaction {
  constructor(
    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.ListTradeTransactionsFromMonth)
    private readonly listTradeTransactionsFromMonth: ListTradeTransactionsFromMonth,

    @inject(TYPES.UpdateOrLiquidateShare)
    private readonly updateOrLiquidateShare: UpdateOrLiquidateShare,
  ) {}

  async execute(
    transaction: TransactionDTO,
    balanceManagement: BalanceManagement,
  ): Promise<void> {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      throw new NotFoundError(ReasonPhrases.SHARE_NOT_FOUND);
    }

    const earningOrLoss = share.getEarningOrLoss(transaction);

    share.updatePosition(transaction);

    const [buyTransactions, sellTransactions] =
      await this.listTradeTransactionsFromMonth.execute(transaction);

    const monthlySales = sellTransactions.reduce(
      (acc, sellTransaction) => acc + sellTransaction.totalCost,
      0,
    );

    balanceManagement.setType(buyTransactions, sellTransactions);
    balanceManagement.handleSellOperation(monthlySales, earningOrLoss);

    return this.updateOrLiquidateShare.execute(share);
  }
}

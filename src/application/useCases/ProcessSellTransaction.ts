import { TYPES } from '@constants/types';
import { TransactionDTO } from '@domain/shared/types';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateOrLiquidateShare from './UpdateOrLiquidateShare';
import ListTradeTransactionsFromMonth from './ListTradeTransactionsFromMonth';
import FinancialReport from '@domain/financialReport/FinancialReport';

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
    financialReport: FinancialReport,
    monthlyTransactions?: TransactionDTO[],
  ): Promise<void> {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      throw new Error();
    }

    const earningOrLoss = share.getEarningOrLoss(transaction);

    share.updatePosition(transaction);

    const [buyTransactions, sellTransactions] =
      await this.listTradeTransactionsFromMonth.execute(
        transaction,
        monthlyTransactions,
      );

    const monthlySales = sellTransactions.reduce(
      (acc, sellTransaction) => acc + sellTransaction.totalCost,
      0,
    );

    financialReport.setType(buyTransactions, sellTransactions);
    financialReport.handleSellOperation(
      monthlySales,
      transaction.totalCost,
      earningOrLoss,
    );

    return this.updateOrLiquidateShare.execute(share);
  }
}

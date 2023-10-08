import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateOrLiquidateShare from './UpdateOrLiquidateShare';
import ListTradeTransactionsFromMonth from './ListTradeTransactionsFromMonth';
import {
  MONTHLY_BALANCE_SALES_LIMIT,
  MONTHLY_BALANCE_TYPE,
} from '@domain/financialReport/monthlyBalance/MonthlyBalanceEnums';
import FinancialReport from '@domain/financialReport/FinancialReport';
import CreateFinancialReportFromBalances from './CreateFinancialReportFromBalances';
import UpdateBalancesFromFinancialReport from './UpdateBalancesFromFinancialReport';

@injectable()
export default class ProcessSellTransaction {
  constructor(
    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.ListTradeTransactionsFromMonth)
    private readonly listTradeTransactionsFromMonth: ListTradeTransactionsFromMonth,

    @inject(TYPES.UpdateOrLiquidateShare)
    private readonly updateOrLiquidateShare: UpdateOrLiquidateShare,

    @inject(TYPES.CreateFinancialReportFromBalances)
    private readonly createFinancialReportFromBalances: CreateFinancialReportFromBalances,

    @inject(TYPES.UpdateBalancesFromFinancialReport)
    private readonly updateBalancesFromFinancialReport: UpdateBalancesFromFinancialReport,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const financialReport =
      await this.createFinancialReportFromBalances.execute(transaction);

    const share = await this.getShare.execute(transaction);

    if (!share) {
      throw new Error();
    }

    const earningOrLoss = share.getEarningsOrLoss(transaction);

    share.updatePosition(
      transaction.getQuantity(),
      transaction.getTotalCost(),
      transaction.getType(),
    );

    const [buyTransactions, sellTransactions] =
      await this.listTradeTransactionsFromMonth.execute(transaction);

    const monthlySales = sellTransactions.reduce(
      (acc, sellTransaction) => acc + sellTransaction.getTotalCost(),
      0,
    );

    financialReport.setType(buyTransactions, sellTransactions);
    financialReport.setTaxWithholding(monthlySales);

    if (earningOrLoss < 0) {
      const totalLoss = Math.abs(earningOrLoss);
      this.handleLoss(financialReport, totalLoss);
    }

    if (earningOrLoss > 0) {
      this.handleEarnings(monthlySales, earningOrLoss, financialReport);
    }

    await Promise.all([
      this.updateOrLiquidateShare.execute(share),
      this.updateBalancesFromFinancialReport.execute(
        financialReport,
        transaction,
      ),
    ]);
  }

  handleEarnings(
    monthlySales: number,
    earning: number,
    financialReport: FinancialReport,
  ) {
    financialReport.setTradeEarnings(earning);

    const sellMoreThanLimit =
      monthlySales > MONTHLY_BALANCE_SALES_LIMIT.TO_CHARGE_TAX;

    const didDayTrade =
      financialReport.monthlyOperationType === MONTHLY_BALANCE_TYPE.DAY_TRADE;

    if (sellMoreThanLimit || didDayTrade) {
      financialReport.calculateTax();
    }
  }

  handleLoss(financialReport: FinancialReport, totalLoss: number) {
    financialReport.setFinancialLosses(totalLoss);

    if (financialReport.monthlyTax <= 0) {
      return;
    }

    financialReport.calculateTax();
  }
}

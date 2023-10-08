import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import CreateFinancialReportFromBalances from './CreateFinancialReportFromBalances';
import UpdateBalancesFromFinancialReport from './UpdateBalancesFromFinancialReport';

@injectable()
export default class ProcessDividendTransaction {
  constructor(
    @inject(TYPES.CreateFinancialReportFromBalances)
    private readonly createFinancialReportFromBalances: CreateFinancialReportFromBalances,

    @inject(TYPES.UpdateBalancesFromFinancialReport)
    private readonly updateBalancesFromFinancialReport: UpdateBalancesFromFinancialReport,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<[void, void]> {
    const financialReport =
      await this.createFinancialReportFromBalances.execute(transaction);

    financialReport.setDividendEarnings(transaction.totalCost);

    return this.updateBalancesFromFinancialReport.execute(
      financialReport,
      transaction,
    );
  }
}

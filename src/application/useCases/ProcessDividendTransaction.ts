import { AbstractTransaction } from '@domain/shared/interfaces';
import { injectable } from 'inversify';
import FinancialReport from '@domain/financialReport/FinancialReport';

@injectable()
export default class ProcessDividendTransaction {
  async execute(
    transaction: AbstractTransaction,
    financialReport: FinancialReport,
  ): Promise<void> {
    financialReport.setDividendEarnings(transaction.totalCost);
  }
}

import { injectable } from 'inversify';
import FinancialReport from '@domain/financialReport/FinancialReport';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class ProcessDividendTransaction {
  async execute(
    transaction: TransactionDTO,
    financialReport: FinancialReport,
  ): Promise<void> {
    financialReport.setDividendEarning(transaction.totalCost);
  }
}

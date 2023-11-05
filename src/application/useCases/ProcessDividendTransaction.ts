import { injectable } from 'inversify';
import BalanceManagement from '@domain/balance/BalanceManagement';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class ProcessDividendTransaction {
  async execute(
    transaction: TransactionDTO,
    balanceManagement: BalanceManagement,
  ): Promise<void> {
    balanceManagement.setDividendEarning(transaction.totalCost);
  }
}

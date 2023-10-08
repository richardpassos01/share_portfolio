import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import GetOrCreateMonthlyBalance from './GetOrCreateMonthlyBalance';
import UpdateMonthlyBalance from './UpdateMonthlyBalance';

@injectable()
export default class ProcessDividendTransaction {
  constructor(
    @inject(TYPES.GetOrCreateMonthlyBalance)
    private readonly getOrCreateMonthlyBalance: GetOrCreateMonthlyBalance,

    @inject(TYPES.UpdateMonthlyBalance)
    private readonly updateMonthlyBalance: UpdateMonthlyBalance,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const monthlyBalance =
      await this.getOrCreateMonthlyBalance.execute(transaction);

    monthlyBalance.setDividendEarnings(transaction.getTotalCost());
    return this.updateMonthlyBalance.execute(monthlyBalance);
  }
}

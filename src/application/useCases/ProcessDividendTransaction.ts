import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import GetMonthlyBalance from './GetMonthlyBalance';
import UpdateMonthlyBalance from './UpdateMonthlyBalance';

@injectable()
export default class ProcessDividendTransaction {
  constructor(
    @inject(TYPES.GetMonthlyBalance)
    private readonly getMonthlyBalance: GetMonthlyBalance,

    @inject(TYPES.UpdateMonthlyBalance)
    private readonly updateMonthlyBalance: UpdateMonthlyBalance,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const monthlyBalance = await this.getMonthlyBalance.execute(transaction);

    monthlyBalance.setDividendEarnings(transaction.getTotalCost());
    return this.updateMonthlyBalance.execute(monthlyBalance);
  }
}

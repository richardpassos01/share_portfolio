import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import CreateShare from './CreateShare';
import UpdateOrLiquidateShare from './UpdateOrLiquidateShare';

@injectable()
export default class ProcessBuyTransaction {
  constructor(
    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.CreateShare)
    private readonly createShare: CreateShare,

    @inject(TYPES.UpdateOrLiquidateShare)
    private readonly updateOrLiquidateShare: UpdateOrLiquidateShare,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      return this.createShare.execute(transaction);
    }

    share.updatePosition(
      transaction.quantity,
      transaction.totalCost,
      transaction.type,
    );
    return this.updateOrLiquidateShare.execute(share);
  }
}

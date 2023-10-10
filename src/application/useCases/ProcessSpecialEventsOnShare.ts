import { TYPES } from '@constants/types';
import { TransactionDTO } from '@domain/shared/types';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateOrLiquidateShare from './UpdateOrLiquidateShare';

@injectable()
export default class ProcessSpecialEventsOnShare {
  constructor(
    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.UpdateOrLiquidateShare)
    private readonly updateOrLiquidateShare: UpdateOrLiquidateShare,
  ) {}

  async execute(transaction: TransactionDTO): Promise<void> {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      throw new Error();
    }

    const quantity = share.quantity + transaction.quantity;

    share.setQuantity(quantity);
    return this.updateOrLiquidateShare.execute(share);
  }
}

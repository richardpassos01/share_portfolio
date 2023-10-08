import { TYPES } from '@constants/types';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateShare from './UpdateShare';

@injectable()
export default class ProcessSpecialEventsOnShare {
  constructor(
    @inject(TYPES.GetShare)
    private readonly getShare: GetShare,

    @inject(TYPES.UpdateShare)
    private readonly updateShare: UpdateShare,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const share = await this.getShare.execute(transaction);

    if (!share) {
      throw new Error();
    }

    const quantity = share.getQuantity() + transaction.getQuantity();

    share.setQuantity(quantity);
    return this.updateShare.execute(share);
  }
}

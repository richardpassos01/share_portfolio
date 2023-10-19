import { TYPES } from '@constants/types';
import { TransactionDTO } from '@domain/shared/types';
import { inject, injectable } from 'inversify';
import GetShare from '@application/queries/GetShare';
import UpdateOrLiquidateShare from './UpdateOrLiquidateShare';
import NotFoundError from '@domain/shared/error/NotFoundError';
import { ReasonPhrases } from '@domain/shared/enums';

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
      throw new NotFoundError(ReasonPhrases.SHARE_NOT_FOUND);
    }

    share.updatePosition(transaction);

    return this.updateOrLiquidateShare.execute(share);
  }
}

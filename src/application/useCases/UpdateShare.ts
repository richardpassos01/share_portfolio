import { TRANSACTION_CATEGORY } from '@domain/shared/enums';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import { TransactionDTO } from '@domain/shared/types';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';

@injectable()
export default class UpdateShare {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,
  ) {}

  async execute(share: Share, transaction: TransactionDTO): Promise<void> {
    const isBonusShare =
      transaction.category === TRANSACTION_CATEGORY.BONUS_SHARE;
    const isSplit = transaction.category === TRANSACTION_CATEGORY.SPLIT;
    const isTrade = transaction.category === TRANSACTION_CATEGORY.TRADE;

    if (isBonusShare || isSplit || isTrade) {
      share.updatePosition(transaction);
      return this.handleLiquitation(share);
    }
  }

  async handleLiquitation(share: Share): Promise<void> {
    const isLiquidation = share.quantity === 0;

    if (isLiquidation) {
      return this.shareRepository.delete(share.id);
    }

    return this.shareRepository.update(share);
  }
}

import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class UpdateShare {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,
  ) {}

  async execute(share: Share): Promise<void> {
    if (share.getQuantity() === 0) {
      return this.shareRepository.delete(share.getId());
    }

    return this.shareRepository.update(share);
  }
}

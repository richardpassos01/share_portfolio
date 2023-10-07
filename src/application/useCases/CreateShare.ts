import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import { injectable, inject } from 'inversify';
import { AbstractTransaction } from '@domain/shared/interfaces';

@injectable()
export default class CreateShare {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const share = new Share(
      transaction.getInstitutionId(),
      transaction.getTicketSymbol(),
      transaction.getQuantity(),
      transaction.getTotalCost(),
    );

    return this.shareRepository.create(share);
  }
}

import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { injectable, inject } from 'inversify';

@injectable()
export default class GetShare {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<Share | undefined> {
    return this.shareRepository.get(
      transaction.getInstitutionId(),
      transaction.getTicketSymbol(),
    );
  }
}

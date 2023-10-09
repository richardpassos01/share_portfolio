import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import { injectable, inject } from 'inversify';
import { TransactionDTO } from '@domain/shared/types';

@injectable()
export default class CreateShare {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,
  ) {}

  async execute({
    institutionId,
    ticketSymbol,
    quantity,
    totalCost,
  }: TransactionDTO): Promise<void> {
    const share = new Share(institutionId, ticketSymbol, quantity, totalCost);

    return this.shareRepository.create(share);
  }
}

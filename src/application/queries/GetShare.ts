import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import { TransactionDTO } from '@domain/shared/types';
import { injectable, inject } from 'inversify';

@injectable()
export default class GetShare {
  constructor(
    @inject(TYPES.ShareRepository)
    private readonly shareRepository: ShareRepositoryInterface,
  ) {}

  async execute({
    institutionId,
    ticketSymbol,
  }: TransactionDTO): Promise<Share | undefined> {
    return this.shareRepository.get(institutionId, ticketSymbol);
  }
}

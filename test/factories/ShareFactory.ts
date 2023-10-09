import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import institution from '@fixtures/institution';

type Params = {
  id?: string;
  institutionId?: string;
  ticketSymbol?: string;
  quantity?: number;
  totalCost?: number;
};

export default class ShareFactory {
  private share: Share;

  constructor(
    {
      id,
      institutionId = institution.id,
      ticketSymbol = 'TSLA',
      quantity = 100,
      totalCost = 1000,
    } = {} as Params,
    share?: Share,
  ) {
    this.share =
      share || new Share(institutionId, ticketSymbol, quantity, totalCost, id);
  }

  get() {
    return this.share;
  }

  getObject() {
    return {
      institutionId: this.share.institutionId,
      ticketSymbol: this.share.ticketSymbol,
      quantity: this.share.quantity,
      totalCost: this.share.totalCost,
      mediumPrice: this.share.mediumPrice,
    };
  }

  async save() {
    const shareRepository = container.get<ShareRepositoryInterface>(
      TYPES.ShareRepository,
    );
    return shareRepository.create(this.share);
  }
}

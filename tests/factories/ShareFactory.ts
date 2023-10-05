import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import Share from '@domain/share/Share';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';

type Params = {
  id?: string;
  institutionId?: string;
  ticketSymbol?: string;
  quantity?: number;
  totalCost?: number;
} 

export default class ShareFactory {
  private share: Share;

  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    ticketSymbol = 'TSLA',
    quantity = 100,
    totalCost = 1000,
  } = {} as Params,
  share: Share
  ) {
    this.share = share || new Share(
      institutionId,
      ticketSymbol,
      quantity,
      totalCost,
      id,
    );
  }

  get() {
    return this.share;
  }

  getObject() {
    return {
      institutionId: this.share.getInstitutionId(),
      ticketSymbol: this.share.getTicketSymbol(),
      quantity: this.share.getQuantity(),
      totalCost: this.share.getTotalCost(),
      mediumPrice: this.share.getMediumPrice(),
    };
  }

  async save() {
    const shareRepository = container.get<ShareRepositoryInterface>(TYPES.ShareRepository);
    return shareRepository.create(this.share);
  }
}

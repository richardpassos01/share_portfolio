import Share from '../../src/domain/share/Share';
import { shareRepository } from '../../src/DependencyInjectionContainer';

export default class ShareFactory {
  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    ticketSymbol = 'TSLA',
    quantity = 100,
    totalCost = 1000,
  } = {}) {
    this.share = new Share({
      id,
      institutionId,
      ticketSymbol,
      quantity,
      totalCost,
    });
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
    return shareRepository.create(this.share);
  }
}

import Share from '../../domain/share/Share.js';

export default class createShare {
  constructor(shareRepository) {
    this.shareRepository = shareRepository;
  }

  async execute({ institutionId, ticketSymbol, quantity, totalPrice }) {
    const share = new Share({
      institutionId,
      ticketSymbol,
      quantity,
      totalCost: totalPrice,
      mediumPrice: 0,
    });
    share.updateMediumPrice();

    return this.shareRepository.create(share);
  }
}

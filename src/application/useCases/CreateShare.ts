import Share from '../../domain/share/Share';

export default class CreateShare {
  constructor(shareRepository) {
    this.shareRepository = shareRepository;
  }

  async execute({ institutionId, ticketSymbol, quantity, totalCost }) {
    const share = new Share({
      institutionId,
      ticketSymbol,
      quantity,
      totalCost,
    });

    return this.shareRepository.create(share);
  }
}
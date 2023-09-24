export default class GetShare {
  constructor(shareRepository) {
    this.shareRepository = shareRepository;
  }

  async execute({ ticketSymbol, institutionId }) {
    return this.shareRepository.get(ticketSymbol, institutionId);
  }
}

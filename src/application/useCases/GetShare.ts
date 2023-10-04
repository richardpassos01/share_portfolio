export default class GetShare {
  constructor(shareRepository) {
    this.shareRepository = shareRepository;
  }

  async execute({ institutionId, ticketSymbol }) {
    return this.shareRepository.get(institutionId, ticketSymbol);
  }
}

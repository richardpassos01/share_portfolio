export default class UpdateShare {
  constructor(shareRepository) {
    this.shareRepository = shareRepository;
  }

  async execute(share, transaction) {
    share.updatePosition(transaction);
    return this.shareRepository.update(share);
  }
}

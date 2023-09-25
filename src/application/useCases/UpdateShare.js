export default class UpdateShare {
  constructor(shareRepository) {
    this.shareRepository = shareRepository;
  }

  async execute(share) {
    return this.shareRepository.update(share);
  }
}

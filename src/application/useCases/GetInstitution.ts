export default class GetInstitution {
  constructor(institutionRepository) {
    this.institutionRepository = institutionRepository;
  }

  async execute(institutionId) {
    return this.institutionRepository.get(institutionId);
  }
}

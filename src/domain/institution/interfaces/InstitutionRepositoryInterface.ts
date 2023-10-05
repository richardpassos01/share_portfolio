import Institution from '../Institution';

export default interface InstitutionRepositoryInterface {
  get(institutionId: string): Promise<Institution>;
  create(institution: Institution): Promise<void>;
}

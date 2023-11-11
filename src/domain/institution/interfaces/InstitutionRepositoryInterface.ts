import Institution from '../Institution';

export default interface InstitutionRepositoryInterface {
  list(userId: string): Promise<Institution[]>;
  create(institution: Institution): Promise<void>;
}

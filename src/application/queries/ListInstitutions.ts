import { TYPES } from '@constants/types';
import Institution from '@domain/institution/Institution';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class ListInstitutions {
  constructor(
    @inject(TYPES.InstitutionRepository)
    private readonly institutionRepository: InstitutionRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<Institution[]> {
    return this.institutionRepository.list(userId);
  }
}

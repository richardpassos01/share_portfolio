import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import Institution from '@domain/institution/Institution';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';

@injectable()
export default class CreateInstitution {
  constructor(
    @inject(TYPES.InstitutionRepository)
    private readonly institutionRepository: InstitutionRepositoryInterface,
  ) {}

  async execute(name: string, userId: string) {
    const institution = new Institution(name, userId);

    return this.institutionRepository.create(institution);
  }
}

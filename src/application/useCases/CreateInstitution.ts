import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import Institution from '@domain/institution/Institution';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import { InstitutionId } from '@domain/institution/interfaces/InstitutionResponseInterfaces';

@injectable()
export default class CreateInstitution {
  constructor(
    @inject(TYPES.InstitutionRepository)
    private readonly institutionRepository: InstitutionRepositoryInterface,
  ) {}

  async execute(name: string, userId: string): Promise<InstitutionId> {
    const institution = new Institution(name, userId);

    await this.institutionRepository.create(institution);

    const institutionId: InstitutionId = {
      id: institution.getId(),
    };

    return institutionId;
  }
}

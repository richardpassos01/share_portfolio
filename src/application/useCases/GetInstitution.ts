import { TYPES } from '@constants/types';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class GetInstitution {
  constructor(
    @inject(TYPES.InstitutionRepository)
    private readonly institutionRepository: InstitutionRepositoryInterface,
  ) {}

  async execute(institutionId: string) {
    return this.institutionRepository.get(institutionId);
  }
}

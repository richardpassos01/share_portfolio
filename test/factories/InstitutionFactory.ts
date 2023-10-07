import Institution from '@domain/institution/Institution';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import institution from '@fixtures/institution';

export default class InstitutionFactory {
  private institution: Institution;

  constructor({
    id = institution.id,
    name = 'INTER DTVM LTDA',
    userId = institution.userId,
  } = {}) {
    this.institution = new Institution(name, userId, id);
  }

  async save() {
    const institutionRepository = container.get<InstitutionRepositoryInterface>(
      TYPES.InstitutionRepository,
    );
    return institutionRepository.create(this.institution);
  }

  get() {
    return this.institution;
  }

  getObject() {
    return {
      id: this.institution.getId(),
      name: this.institution.getName(),
      userId: this.institution.getUserId(),
    };
  }

  getPayloadObject() {
    const { id: _, ...payload } = this.getObject();
    return payload;
  }
}

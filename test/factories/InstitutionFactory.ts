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
      id: this.institution.id,
      name: this.institution.name,
      userId: this.institution.userId,
    };
  }

  getPayloadObject() {
    const { id: _, ...payload } = this.getObject();
    return payload;
  }
}

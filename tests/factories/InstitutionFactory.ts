import Institution from '@domain/institution/Institution';
import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';

export default class InstitutionFactory {
  private institution: Institution;

  constructor({
    id = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    name = 'INTER DTVM LTDA',
    userId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
  } = {}) {
    this.institution = new Institution(name, userId, id);
  }

  async save() {
    const institutionRepository = container.get<InstitutionRepositoryInterface>(TYPES.InstitutionRepository);
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
}

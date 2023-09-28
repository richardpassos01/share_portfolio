import Institution from '../../src/domain/institution/Institution.js';

export default class InstitutionFactory {
  constructor({
    id = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    name = 'INTER DTVM LTDA',
    userId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
  } = {}) {
    this.institution = new Institution({ id, name, userId });
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

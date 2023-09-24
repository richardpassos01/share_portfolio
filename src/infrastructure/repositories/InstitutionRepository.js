import InstitutionMapper from '../mappers/InstitutionMapper.js';
import Tables from '../database/Tables.js';

export default class InstitutionRepository {
  constructor(database) {
    this.database = database;
  }

  async get(instituionId) {
    return this.database
      .connection()
      .select()
      .where('id', instituionId)
      .into(Tables.INSTITUTION)
      .first()
      .then((data) => InstitutionMapper.mapToEntity(data));
  }
}

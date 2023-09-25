import TotalBalanceMapper from '../mappers/TotalBalanceMapper.js';
import Tables from '../database/Tables.js';

export default class TotalBalanceRepository {
  constructor(database) {
    this.database = database;
  }

  async get(instituionId) {
    return this.database
      .connection()
      .select()
      .where('institution_id', instituionId)
      .into(Tables.TOTAL_BALANCE)
      .first()
      .then((data) => (data ? TotalBalanceMapper.mapToEntity(data) : null));
  }

  async create(balance) {
    return this.database
      .connection()
      .insert(TotalBalanceMapper.mapToDatabaseObject(balance))
      .into(Tables.TOTAL_BALANCE);
  }

  async update(balance) {
    return this.database
      .connection()
      .update(TotalBalanceMapper.mapToDatabaseObject(balance))
      .where('id', balance.getId())
      .into(Tables.TOTAL_BALANCE);
  }
}

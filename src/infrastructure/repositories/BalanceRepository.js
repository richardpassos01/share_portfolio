import BalanceMapper from '../mappers/BalanceMapper.js';
import Tables from '../database/Tables.js';

export default class BalanceRepository {
  constructor(database) {
    this.database = database;
  }

  async get(instituionId, yearMonth) {
    return this.database
      .connection()
      .select()
      .where({
        year_month: yearMonth,
        institution_id: instituionId,
      })
      .into(Tables.TRANSACTION)
      .orderBy('date', 'asc')
      .then((data) => (data ? BalanceMapper.mapToEntity(data) : null));
  }

  async create(balance) {
    return this.database
      .connection()
      .insert(BalanceMapper.mapToDatabaseObject(balance))
      .into(Tables.BALANCE);
  }

  async update(balance) {
    return this.database
      .connection()
      .update(BalanceMapper.mapToDatabaseObject(balance))
      .where('id', balance.id)
      .into(Tables.BALANCE);
  }
}

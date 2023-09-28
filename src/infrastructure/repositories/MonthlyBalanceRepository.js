import MonthlyBalanceMapper from '../mappers/MonthlyBalanceMapper.js';
import Tables from '../database/Tables.js';

export default class MonthlyBalanceRepository {
  constructor(database) {
    this.database = database;
  }

  async get(institutionId, yearMonth) {
    return this.database
      .connection()
      .select()
      .where({
        year_month: yearMonth,
        institution_id: institutionId,
      })
      .into(Tables.MONTHLY_BALANCE)
      .first()
      .then((data) => (data ? MonthlyBalanceMapper.mapToEntity(data) : null));
  }

  async create(balance) {
    return this.database
      .connection()
      .insert(MonthlyBalanceMapper.mapToDatabaseObject(balance))
      .into(Tables.MONTHLY_BALANCE);
  }

  async update(balance) {
    return this.database
      .connection()
      .update(MonthlyBalanceMapper.mapToDatabaseObject(balance))
      .where('id', balance.getId())
      .into(Tables.MONTHLY_BALANCE);
  }
}

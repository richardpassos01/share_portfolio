import Tables from '../database/Tables.js';
import ShareMapper from '../mappers/ShareMapper.js';

export default class ShareRepository {
  constructor(database) {
    this.database = database;
  }

  async get(ticketSymbol, institutionId) {
    return this.database
      .connection()
      .select()
      .where({ ticket_symbol: ticketSymbol, institution_id: institutionId })
      .into(Tables.SHARE)
      .first()
      .then((data) => (data ? ShareMapper.mapToEntity(data) : null));
  }

  async getAll(institutionId) {
    return this.database
      .connection()
      .select()
      .where({ institution_id: institutionId })
      .into(Tables.SHARE)
      .then((data) => data.map(ShareMapper.mapToEntity));
  }

  async create(share) {
    return this.database
      .connection()
      .insert(ShareMapper.mapToDatabaseObject(share))
      .into(Tables.SHARE);
  }

  async update(share) {
    return this.database
      .connection()
      .update(ShareMapper.mapToDatabaseObject(share))
      .where('id', share.getId())
      .into(Tables.SHARE);
  }

  async delete(share) {
    return this.database
      .connection()
      .where('id', share.getId())
      .del()
      .into(Tables.SHARE);
  }
}

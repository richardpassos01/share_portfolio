import Tables from '../database/Tables.js';
import ShareMapper from '../mappers/ShareMapper.js';

export default class ShareRepository {
  constructor(database) {
    this.database = database;
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
      .where('id', share.id)
      .into(Tables.SHARE);
  }

  async get(ticketSymbol, instituionId) {
    return this.database
      .connection()
      .select(
        'id',
        'institution_id',
        'ticket_symbol',
        'quantity',
        'total_cost',
        'medium_price',
      )
      .where({ ticket_symbol: ticketSymbol, institution_id: instituionId })
      .first()
      .into(Tables.SHARE)
      .then((data) => (data ? ShareMapper.mapToEntity(data) : null));
  }
}

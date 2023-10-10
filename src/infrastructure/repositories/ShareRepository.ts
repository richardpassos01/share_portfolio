import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import TABLES from '../database/Tables';
import ShareMapper from '../mappers/ShareMapper';
import Database from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';

@injectable()
export default class ShareRepository implements ShareRepositoryInterface {
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database,
  ) {}

  async get(institutionId: string, ticketSymbol: string) {
    return this.database
      .connection()
      .select()
      .where({ ticket_symbol: ticketSymbol, institution_id: institutionId })
      .into(TABLES.SHARE)
      .first()
      .then((data) => (data ? ShareMapper.mapToEntity(data) : undefined));
  }

  async create(share: Share) {
    await this.database
      .connection()
      .insert(ShareMapper.mapToDatabaseObject(share))
      .into(TABLES.SHARE);
  }

  async update(share: Share) {
    await this.database
      .connection()
      .update(ShareMapper.mapToDatabaseObject(share))
      .where('id', share.id)
      .into(TABLES.SHARE);
  }

  async delete(id: string) {
    await this.database.connection().where('id', id).del().into(TABLES.SHARE);
  }

  async list(institutionId: string) {
    return this.database
      .connection()
      .select()
      .where({ institution_id: institutionId })
      .into(TABLES.SHARE)
      .then((data) => data.map(ShareMapper.mapToEntity));
  }

  async deleteAll(institutionId: string) {
    await this.database
      .connection()
      .where('institution_id', institutionId)
      .del()
      .into(TABLES.SHARE);
  }
}

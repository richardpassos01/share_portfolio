import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import Tables from '../database/Tables';
import ShareMapper from '../mappers/ShareMapper';
import Database from '@infrastructure/database';
import {inject, injectable} from 'inversify';
import { TYPES } from '@constants/types';
import Share from '@domain/share/Share';

@injectable()
export default class ShareRepository implements ShareRepositoryInterface {
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database
  ) {}

  async get(institutionId: string, ticketSymbol: string) {
    return this.database
      .connection()
      .select()
      .where({ ticket_symbol: ticketSymbol, institution_id: institutionId })
      .into(Tables.SHARE)
      .first()
      .then((data) => (data ? ShareMapper.mapToEntity(data) : null));
  }

  async getAll(institutionId: string) {
    return this.database
      .connection()
      .select()
      .where({ institution_id: institutionId })
      .into(Tables.SHARE)
      .then((data) => data.map(ShareMapper.mapToEntity));
  }

  async create(share: Share) {
    await this.database
      .connection()
      .insert(ShareMapper.mapToDatabaseObject(share))
      .into(Tables.SHARE);
  }

  async update(share: Share) {
    await this.database
      .connection()
      .update(ShareMapper.mapToDatabaseObject(share))
      .where('id', share.getId())
      .into(Tables.SHARE);
  }

  async delete(share: Share) {
    await this.database
      .connection()
      .where('id', share.getId())
      .del()
      .into(Tables.SHARE);
  }
}

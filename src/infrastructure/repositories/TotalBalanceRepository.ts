import TotalBalanceMapper from '../mappers/TotalBalanceMapper';
import { TYPES } from '@constants/types';
import TotalBalance from '@domain/portfolio/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/portfolio/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import Database, { TABLES } from '@infrastructure/database';
import { inject, injectable } from 'inversify';

@injectable()
export default class TotalBalanceRepository
  implements TotalBalanceRepositoryInterface
{
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database,
  ) {}

  async get(institutionId: string) {
    return this.database
      .connection()
      .select()
      .where('institution_id', institutionId)
      .into(TABLES.TOTAL_BALANCE)
      .first()
      .then((data) =>
        data ? TotalBalanceMapper.mapToEntity(data) : undefined,
      );
  }

  async createOrUpdate(balance: TotalBalance) {
    await this.database
      .connection()
      .insert(TotalBalanceMapper.mapToDatabaseObject(balance))
      .into(TABLES.TOTAL_BALANCE)
      .onConflict('institution_id')
      .merge();
  }

  async delete(institutionId: string) {
    await this.database
      .connection()
      .where('institution_id', institutionId)
      .del()
      .into(TABLES.TOTAL_BALANCE);
  }
}

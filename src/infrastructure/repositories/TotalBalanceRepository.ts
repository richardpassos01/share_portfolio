import TotalBalanceMapper from '../mappers/TotalBalanceMapper';
import { TYPES } from '@constants/types';
import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';
import TotalBalanceRepositoryInterface from '@domain/financialReport/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import Database, { Tables } from '@infrastructure/database';
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
      .into(Tables.TOTAL_BALANCE)
      .first()
      .then((data) => TotalBalanceMapper.mapToEntity(data));
  }

  async create(balance: TotalBalance) {
    await this.database
      .connection()
      .insert(TotalBalanceMapper.mapToDatabaseObject(balance))
      .into(Tables.TOTAL_BALANCE);
  }

  async update(balance: TotalBalance) {
    await this.database
      .connection()
      .update(TotalBalanceMapper.mapToDatabaseObject(balance))
      .where('id', balance.id)
      .into(Tables.TOTAL_BALANCE);
  }
}

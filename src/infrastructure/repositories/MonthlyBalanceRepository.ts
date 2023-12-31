import { TYPES } from '@constants/types';
import MonthlyBalanceMapper from '@infrastructure/mappers/MonthlyBalanceMapper';
import Database, { TABLES } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import MonthlyBalanceRepositoryInterface from '@domain/balance/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import MonthlyBalance from '@domain/balance/monthlyBalance/MonthlyBalance';

@injectable()
export default class MonthlyBalanceRepository
  implements MonthlyBalanceRepositoryInterface
{
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database,
  ) {}

  async get(institutionId: string, yearMonth: string) {
    return this.database
      .connection()
      .select()
      .where({
        year_month: yearMonth,
        institution_id: institutionId,
      })
      .into(TABLES.MONTHLY_BALANCE)
      .first()
      .then((data) =>
        data ? MonthlyBalanceMapper.mapToEntity(data) : undefined,
      );
  }

  async list(institutionId: string, limit: number) {
    const query = this.database
      .connection()
      .select()
      .where('institution_id', institutionId)
      .orderBy('created_at', 'desc')
      .into(TABLES.MONTHLY_BALANCE);

    if (limit) {
      void query.limit(limit);
    }

    return query.then((data) => data.map(MonthlyBalanceMapper.mapToEntity));
  }

  async createOrUpdate(balance: MonthlyBalance) {
    await this.database
      .connection()
      .insert(MonthlyBalanceMapper.mapToDatabaseObject(balance))
      .into(TABLES.MONTHLY_BALANCE)
      .onConflict(['institution_id', 'year_month'])
      .merge();
  }

  async deleteAll(institutionId: string) {
    await this.database
      .connection()
      .where('institution_id', institutionId)
      .del()
      .into(TABLES.MONTHLY_BALANCE);
  }

  async sumEarnings(institutionId: string) {
    return this.database
      .connection()
      .select(
        this.database
          .connection()
          .raw('SUM(trade_earning + dividend_earning - tax - tax_withholding)'),
      )
      .from(TABLES.MONTHLY_BALANCE)
      .where('institution_id', institutionId)
      .first();
  }
}

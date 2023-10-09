import { TYPES } from '@constants/types';
import MonthlyBalanceMapper from '@infrastructure/mappers/MonthlyBalanceMapper';
import Database, { Tables } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';

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
      .into(Tables.MONTHLY_BALANCE)
      .first()
      .then((data) =>
        data ? MonthlyBalanceMapper.mapToEntity(data) : undefined,
      );
  }

  async createOrUpdate(balance: MonthlyBalance) {
    await this.database
      .connection()
      .insert(MonthlyBalanceMapper.mapToDatabaseObject(balance))
      .into(Tables.MONTHLY_BALANCE)
      .onConflict(['institution_id', 'year_month'])
      .merge();
  }

  async sumEarnings(institutionId: string) {
    return this.database
      .connection()
      .select(
        this.database
          .connection()
          .raw('SUM(trade_earning + dividend_earning - tax - tax_withholding)'),
      )
      .from(Tables.MONTHLY_BALANCE)
      .where('institution_id', institutionId)
      .first();
  }
}

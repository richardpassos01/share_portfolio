import TransactionMapper from '@infrastructure/mappers/TransactionMapper';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import Database, { TABLES } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import Transaction from '@domain/transaction/Transaction';
import { TRANSACTION_CATEGORY } from '@domain/shared/enums';
import Pagination, { MapperFunction } from '@domain/shared/Pagination';

@injectable()
export default class TransactionRepository
  implements TransactionRepositoryInterface
{
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database,
  ) {}

  async createMany(transactions: Transaction[]) {
    await this.database
      .connection()
      .insert(transactions.map(TransactionMapper.mapToDatabaseObject))
      .into(TABLES.TRANSACTION);
  }

  async delete(institutionId: string, ids: string[]) {
    await this.database
      .connection()
      .where('institution_id', institutionId)
      .whereIn('id', ids)
      .del()
      .into(TABLES.TRANSACTION);
  }

  async list(institutionId: string, page = 1, limit = 100) {
    return this.database
      .connection()
      .select(
        this.database.connection().raw('COUNT(*) OVER() as total_count'),
        `${TABLES.TRANSACTION}.*`,
      )
      .where('institution_id', institutionId)
      .into(TABLES.TRANSACTION)
      .orderBy('date', 'asc')
      .orderBy('type', 'asc')
      .limit(limit)
      .offset((page - 1) * limit)
      .then(
        (data) =>
          new Pagination(
            page,
            limit,
            data,
            TransactionMapper.mapToEntity as MapperFunction,
          ),
      );
  }

  async listFromMonth(institutionId: string, date: Date) {
    return this.database
      .connection()
      .select()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        institution_id: institutionId,
      })
      .whereRaw(
        'EXTRACT(YEAR FROM date) = ? AND EXTRACT(MONTH FROM date) = ?',
        [date.getFullYear(), date.getMonth() + 1],
      )
      .into(TABLES.TRANSACTION)
      .orderBy('date', 'asc')
      .then((data) =>
        data
          ? data.map((transaction) =>
              TransactionMapper.mapToEntity(transaction),
            )
          : [],
      );
  }
}

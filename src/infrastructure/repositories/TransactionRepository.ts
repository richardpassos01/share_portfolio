import TransactionMapper from '@infrastructure/mappers/TransactionMapper';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import Database, { TABLES } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import Transaction from '@domain/transaction/Transaction';
import { TRANSACTION_CATEGORY } from '@domain/shared/enums';
import Pagination, { MapperFunction } from '@domain/shared/Pagination';
import { TransactionDTO } from '@domain/shared/types';

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
      .distinct()
      .orderBy(['date', 'type'])
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

  async listFromMonth({ institutionId, date, id }: TransactionDTO) {
    const filteredDataQuery = this.database
      .connection()
      .select('*')
      .distinct()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        institution_id: institutionId,
      })
      .whereRaw(
        'EXTRACT(YEAR FROM date) = ? AND EXTRACT(MONTH FROM date) = ?',
        [date.getFullYear(), date.getMonth() + 1],
      )
      .orderBy(['date', 'type'])
      .from(TABLES.TRANSACTION);

    const rowNumberQuery = this.database
      .connection()
      .select('*')
      .rowNumber('row_number_alias', ['date', 'type'])
      .from('filtered_data_query');

    const selectRowNumberQuery = this.database
      .connection()
      .select('row_number_alias')
      .from('row_number_query')
      .where('id', id);

    return await this.database
      .connection()
      .with('filtered_data_query', filteredDataQuery)
      .with('row_number_query', rowNumberQuery)
      .select('*')
      .from('row_number_query')
      .where('row_number_alias', '<=', selectRowNumberQuery)
      .then((data) =>
        data
          ? data.map((transaction) =>
              TransactionMapper.mapToEntity(transaction),
            )
          : [],
      );
  }
}

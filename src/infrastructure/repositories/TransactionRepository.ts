import TransactionMapper from '@infrastructure/mappers/TransactionMapper';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import Database, { Tables } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import Transaction from '@domain/transaction/Transaction';
import { TRANSACTION_CATEGORY } from '@domain/shared/enums';

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
      .into(Tables.TRANSACTION);
  }

  async delete(ids: string[]) {
    await this.database
      .connection()
      .whereIn('id', ids)
      .del()
      .into(Tables.TRANSACTION);
  }

  async list(institutionId: string) {
    return this.database
      .connection()
      .select()
      .where('institution_id', institutionId)
      .into(Tables.TRANSACTION)
      .then((data) => (data ? data.map(TransactionMapper.mapToEntity) : []));
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
      .into(Tables.TRANSACTION)
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

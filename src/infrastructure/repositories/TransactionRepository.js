import { TRANSACTION_CATEGORY } from '../../domain/transaction/TransactionEnums.js';
import TransactionMapper from '../mappers/TransactionMapper.js';
import Tables from '../database/Tables.js';

export default class TransactionRepository {
  constructor(database) {
    this.database = database;
  }

  async get(institutionId) {
    return this.database
      .connection()
      .select()
      .where('institution_id', institutionId)
      .into(Tables.TRANSACTION)
      .then((data) => (data ? data.map(TransactionMapper.mapToEntity) : []));
  }

  async create(transaction) {
    return this.database
      .connection()
      .insert(TransactionMapper.mapToDatabaseObject(transaction))
      .into(Tables.TRANSACTION);
  }

  async getTransactionsFromMonth(institutionId, date) {
    return this.database
      .connection()
      .select()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        institution_id: institutionId,
      })
      .whereRaw(
        `EXTRACT(YEAR FROM date) = ? AND EXTRACT(MONTH FROM date) = ?`,
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

  async getTrades(institutionId) {
    return this.database
      .connection()
      .select()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        institution_id: institutionId,
      })
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

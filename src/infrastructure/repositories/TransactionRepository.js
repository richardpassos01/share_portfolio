import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '../../domain/transaction/TransactionEnums.js';
import TransactionMapper from '../mappers/TransactionMapper.js';
import Tables from '../database/Tables.js';

export default class TransactionRepository {
  constructor(database) {
    this.database = database;
  }

  async getSellTransactionFromPeriod(instituionId, date) {
    return this.database
      .connection()
      .select()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        type: TRANSACTION_TYPE.SELL,
        institution_id: instituionId,
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

  async getTrades(instituionId) {
    return this.database
      .connection()
      .select()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        institution_id: instituionId,
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

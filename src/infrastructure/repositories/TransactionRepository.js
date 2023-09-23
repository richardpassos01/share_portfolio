import { TRANSACTION_CATEGORY } from '../../domain/transaction/TransactionEnums.js';
import TransactionMapper from '../mappers/TransactionMapper.js';
import Tables from '../database/Tables.js';

export default class TransactionRepository {
  constructor(database) {
    this.database = database;
  }

  async getTrades() {
    return this.database
      .connection()
      .select(
        'id',
        'institution_id',
        'type',
        'date',
        'category',
        'ticket_symbol',
        'quantity',
        'unity_price',
        'total_price',
      )
      .where('category', TRANSACTION_CATEGORY.TRADE)
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

import Tables from '../Tables';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../../domain/transaction/TransactionEnums';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.TRANSACTION).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.TRANSACTION, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable();
          table.enu('type', Object.values(TRANSACTION_TYPE)).notNullable();
          table.date('date').notNullable();
          table
            .enu('category', Object.values(TRANSACTION_CATEGORY))
            .notNullable();
          table.string('ticket_symbol', 10).notNullable();
          table.integer('quantity').notNullable();
          table.decimal('unity_price', null).notNullable();
          table.decimal('total_cost', null).notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());

          table
            .foreign('institution_id')
            .references('id')
            .inTable(Tables.INSTITUTION)
            .onDelete('CASCADE');
        })
        .then();
    }
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable(Tables.TRANSACTION);
};
import { Knex } from 'knex';

import TABLES from '../Tables';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../../domain/shared/enums';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLES.TRANSACTION);
  if (!hasTable) {
    return knex.schema
      .createTable(TABLES.TRANSACTION, (table) => {
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
          .inTable(TABLES.INSTITUTION)
          .onDelete('CASCADE');
      })
      .then();
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.TRANSACTION);
}

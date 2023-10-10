import { Knex } from 'knex';
import TABLES from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLES.SHARE);
  if (!hasTable) {
    return knex.schema.createTable(TABLES.SHARE, (table) => {
      table.uuid('id').primary();
      table.uuid('institution_id').notNullable();
      table.string('ticket_symbol', 10).notNullable();
      table.integer('quantity').notNullable();
      table.decimal('total_cost', null);
      table.timestamps(true, true);

      table
        .foreign('institution_id')
        .references('id')
        .inTable(TABLES.INSTITUTION)
        .onDelete('CASCADE');

      table.unique(['institution_id', 'ticket_symbol']);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.SHARE);
}

import { Knex } from 'knex';
import Tables from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(Tables.TOTAL_BALANCE);

  if (!hasTable) {
    return knex.schema.createTable(Tables.TOTAL_BALANCE, (table) => {
      table.uuid('id').primary();
      table.uuid('institution_id').notNullable().unique();
      table.decimal('loss', null);
      table.timestamps(true, true);

      table
        .foreign('institution_id')
        .references('id')
        .inTable(Tables.INSTITUTION)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Tables.TOTAL_BALANCE);
}

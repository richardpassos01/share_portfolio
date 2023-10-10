import { Knex } from 'knex';
import TABLES from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLES.TOTAL_BALANCE);

  if (!hasTable) {
    return knex.schema.createTable(TABLES.TOTAL_BALANCE, (table) => {
      table.uuid('institution_id').notNullable().unique();
      table.decimal('loss', null);
      table.timestamps(true, true);

      table
        .foreign('institution_id')
        .references('id')
        .inTable(TABLES.INSTITUTION)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.TOTAL_BALANCE);
}

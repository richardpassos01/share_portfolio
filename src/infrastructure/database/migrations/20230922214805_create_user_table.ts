import { Knex } from 'knex';
import TABLES from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLES.USER);
  if (!hasTable) {
    return knex.schema.createTable(TABLES.USER, (table) => {
      table.uuid('id').primary();
      table.specificType('document', 'NUMERIC(11)').notNullable();
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.USER);
}

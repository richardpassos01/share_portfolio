import { Knex } from 'knex';
import Tables from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(Tables.USER);
  if (!hasTable) {
    return knex.schema.createTable(Tables.USER, (table) => {
      table.uuid('id').primary();
      table.specificType('document', 'NUMERIC(11)').notNullable();
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Tables.USER);
}

import { Knex } from 'knex';
import TABLES from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLES.INSTITUTION);

  if (!hasTable) {
    return knex.schema.createTable(TABLES.INSTITUTION, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.string('name', 250).notNullable();
      table.timestamps(true, true);

      table.unique(['user_id', 'name']);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.INSTITUTION);
}

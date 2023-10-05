import { Knex } from 'knex';
import Tables from '../Tables';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(Tables.INSTITUTION);

  if (!hasTable) {
    return knex.schema.createTable(Tables.INSTITUTION, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.string('name', 250).notNullable();
      table.timestamps(true, true);

      table
        .foreign('user_id')
        .references('id')
        .inTable(Tables.USER)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Tables.INSTITUTION);
}

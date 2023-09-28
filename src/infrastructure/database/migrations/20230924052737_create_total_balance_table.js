import Tables from '../Tables.js';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.TOTAL_BALANCE).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.TOTAL_BALANCE, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable().unique();
          table.decimal('wins', 10, 2);
          table.decimal('loss', 10, 2);
          table.timestamps(true, true);

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
  return knex.schema.dropTable(Tables.TOTAL_BALANCE);
};

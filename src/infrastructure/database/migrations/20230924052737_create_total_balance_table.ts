import Tables from '../Tables';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.TOTAL_BALANCE).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.TOTAL_BALANCE, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable().unique();
          table.decimal('loss', null);
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

10000000000.0;

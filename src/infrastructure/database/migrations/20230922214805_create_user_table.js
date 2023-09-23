import Tables from '../Tables.js';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.USER).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.USER, (table) => {
          table.uuid('id').primary();
          table.specificType('document', 'NUMERIC(11)').notNullable();
          table.timestamps(true, true);
        })
        .then();
    }
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable(Tables.USER);
};

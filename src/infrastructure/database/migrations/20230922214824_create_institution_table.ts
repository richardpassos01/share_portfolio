import Tables from '../Tables';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.INSTITUTION).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.INSTITUTION, (table) => {
          table.uuid('id').primary();
          table.uuid('user_id').notNullable();
          table.string('name', 250).notNullable();
          table.timestamps(true, true);

          table
            .foreign('user_id')
            .references('id')
            .inTable(Tables.USER)
            .onDelete('CASCADE');
        })
        .then();
    }
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable(Tables.INSTITUTION);
};

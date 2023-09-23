import Tables from '../Tables.js';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.BALANCE).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.BALANCE, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable();
          table.string('year_month', 7).notNullable();
          table.decimal('total_win', 10, 2);
          table.decimal('total_loss', 10, 2);
          table.decimal('total_taxes', 10, 2);
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
  return knex.schema.dropTable(Tables.BALANCE);
};

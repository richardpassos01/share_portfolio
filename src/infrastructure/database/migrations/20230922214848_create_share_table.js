import Tables from '../Tables.js';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.SHARE).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.SHARE, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable();
          table.string('ticket_symbol', 10).notNullable();
          table.integer('quantity').notNullable();
          table.decimal('total_cost', 10, 2);
          table.decimal('medium_price', 10, 2);
          table.timestamps(true, true);

          table
            .foreign('institution_id')
            .references('id')
            .inTable(Tables.INSTITUTION)
            .onDelete('CASCADE');

          table.unique(['institution_id', 'ticket_symbol']);
        })
        .then();
    }
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable(Tables.SHARE);
};

import Tables from '../Tables.js';
import { BALANCE_TYPE } from '../../../domain/transaction/balance/BalanceEnums.js';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.BALANCE).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.BALANCE, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable();
          table.string('year_month', 7).notNullable();
          table.decimal('wins', 10, 2);
          table.decimal('loss', 10, 2);
          table.decimal('taxes', 10, 2);
          table.enu('type', Object.values(BALANCE_TYPE)).notNullable();
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

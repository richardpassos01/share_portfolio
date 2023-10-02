import Tables from '../Tables.js';
import { MONTHLY_BALANCE_TYPE } from '../../../domain/monthlyBalance/MonthlyBalanceEnums.js';

export const up = async (knex) => {
  return knex.schema.hasTable(Tables.MONTHLY_BALANCE).then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable(Tables.MONTHLY_BALANCE, (table) => {
          table.uuid('id').primary();
          table.uuid('institution_id').notNullable();
          table.string('year_month', 7).notNullable();
          table.decimal('trade_earnings', null);
          table.decimal('dividend_earnings', null);
          table.decimal('tax', null);
          table.enu('type', Object.values(MONTHLY_BALANCE_TYPE)).notNullable();
          table.timestamps(true, true);

          table
            .foreign('institution_id')
            .references('id')
            .inTable(Tables.INSTITUTION)
            .onDelete('CASCADE');

          table.unique(['institution_id', 'year_month']);
        })
        .then();
    }
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable(Tables.MONTHLY_BALANCE);
};

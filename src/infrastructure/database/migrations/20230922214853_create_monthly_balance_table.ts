import { Knex } from 'knex';
import Tables from '../Tables';
import { MONTHLY_BALANCE_TYPE } from '../../../domain/monthlyBalance/MonthlyBalanceEnums';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(Tables.MONTHLY_BALANCE);
  if (!hasTable) {
    return knex.schema.createTable(Tables.MONTHLY_BALANCE, (table) => {
      table.uuid('id').primary();
      table.uuid('institution_id').notNullable();
      table.string('year_month', 7).notNullable();
      table.decimal('trade_earnings', null);
      table.decimal('dividend_earnings', null);
      table.decimal('tax', null);
      table.decimal('tax_withholding', null);
      table.decimal('loss', null);
      table.enu('type', Object.values(MONTHLY_BALANCE_TYPE)).notNullable();
      table.timestamps(true, true);

      table
        .foreign('institution_id')
        .references('id')
        .inTable(Tables.INSTITUTION)
        .onDelete('CASCADE');

      table.unique(['institution_id', 'year_month']);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Tables.MONTHLY_BALANCE);
}

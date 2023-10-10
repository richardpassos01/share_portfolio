import { Knex } from 'knex';
import TABLES from '../Tables';

export async function seed(knex: Knex): Promise<void> {
  await knex(TABLES.INSTITUTION).del();
  await knex(TABLES.INSTITUTION).insert([
    {
      id: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      name: 'INTER DTVM LTDA',
      user_id: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    },
  ]);
}

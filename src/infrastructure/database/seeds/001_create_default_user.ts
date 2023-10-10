import { Knex } from 'knex';
import TABLES from '../Tables';

export async function seed(knex: Knex): Promise<void> {
  await knex(TABLES.USER).del();
  await knex(TABLES.USER).insert([
    {
      id: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      document: 70014889099,
    },
  ]);
}

import { Knex } from 'knex';
import Tables from '../Tables';

export async function seed(knex: Knex): Promise<void> {
  await knex(Tables.TOTAL_BALANCE).del();
  await knex(Tables.TOTAL_BALANCE).insert([
    {
      id: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      institution_id: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      loss: 0,
    },
  ]);
}

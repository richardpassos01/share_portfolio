import Tables from '../Tables.js';

export async function seed(knex) {
  await knex(Tables.USER).del();
  await knex(Tables.USER).insert([
    {
      id: 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      document: 70014889099,
    },
  ]);
}

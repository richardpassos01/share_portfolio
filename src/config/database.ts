import path from 'path';
import env from 'env-var';
import pg from 'pg';

pg.types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

export default Object.freeze({
  client: 'pg',
  connection: env.get('DATABASE_CONNECTION_STRING').required(true).asString(),
  migrations: {
    directory: path.resolve(__dirname, '..', 'infrastructure', 'database', 'migrations'),
    tableName: 'migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'infrastructure', 'database', 'seeds')
  },
  useNullAsDefault: true,
  searchPath: ['knex', 'public'],
});

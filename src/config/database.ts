import path from 'path';
import env from 'env-var';
import pg from 'pg';

pg.types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

export default Object.freeze({
  client: 'pg',
  connection: {
    host: env.get('DATABASE_HOST').required(true).asString(),
    port: env.get('DATABASE_PORT').required(true).asPortNumber(),
    user: env.get('DATABASE_USER').required(true).asString(),
    password: env.get('DATABASE_PASSWORD').required(true).asString(),
    database: env.get('DATABASE_NAME').required(true).asString(),
  },
  migrations: {
    extension: 'ts',
    directory: path.resolve(
      __dirname,
      '..',
      'infrastructure',
      'database',
      'migrations',
    ),
    tableName: 'migrations',
  },
  seeds: {
    extension: 'ts',
    directory: path.resolve(
      __dirname,
      '..',
      'infrastructure',
      'database',
      'seeds',
    ),
  },
  useNullAsDefault: true,
  searchPath: ['knex', 'public'],
});

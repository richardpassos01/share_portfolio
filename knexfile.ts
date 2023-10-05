import pg from 'pg';

import DatabaseConfig from './src/config/database';

pg.types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

const KnexConfig = {
  client: DatabaseConfig.client,
  connection: DatabaseConfig.connection,
  migrations: {
    directory: `${__dirname}/src/infrastructure/database/migrations`,
    tableName: 'migrations',
  },
  seeds: {
    directory: `${__dirname}/src/infrastructure/database/seeds`,
  },
  useNullAsDefault: true,
  searchPath: ['knex', 'public'],
};

export default KnexConfig;

import env from 'env-var';

export default Object.freeze({
  client: 'pg',
  connection: env.get('DATABASE_CONNECTION_STRING').required(true).asString(),
});

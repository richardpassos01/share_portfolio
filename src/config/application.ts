import env from 'env-var';

const application = Object.freeze({
  port: env.get('PORT').default(3000).asIntPositive(),
  environment: env.get('NODE_ENV').default('local').asString(),
  apiKey: env.get('API_KEY').required(true).asString(),
});

export default application;

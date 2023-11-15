import Koa from 'koa';
import CustomError from '@domain/shared/error/CustomError';
import AppConfig from '../config/application';

const isValidApiKey = (apiKey: string) => apiKey === AppConfig.apiKey;

const authenticateApiKey = async (ctx: Koa.Context, next: Koa.Next) => {
  const apiKey = ctx.headers['x-api-key'] as string;
  const testEnv = AppConfig.environment === 'test';

  if (testEnv || (apiKey && isValidApiKey(apiKey))) return next();

  const error = new CustomError('Invalid API Key');

  ctx.response.status = error.status;
  ctx.body = error;
};

export default authenticateApiKey;

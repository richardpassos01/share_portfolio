import * as Koa from 'koa';

import CustomError from '@domain/shared/error/CustomError';

const errorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err) {
    const error = err instanceof CustomError ? err : new CustomError();

    ctx.response.status = error.status;
    ctx.body = error;
  }
};

export default errorHandler;
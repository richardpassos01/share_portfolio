import Koa from 'koa';
import CustomError from '@domain/shared/error/CustomError';

const errorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err) {
    let error;

    if (err instanceof CustomError) {
      error = err;
    } else if (err instanceof Error) {
      error = new CustomError(err.message);
    } else {
      error = new CustomError();
    }

    delete error.headers;

    ctx.response.status = error.status;
    ctx.body = error;
  }
};

export default errorHandler;

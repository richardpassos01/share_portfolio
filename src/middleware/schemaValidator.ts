import CustomError from '@domain/shared/error/CustomError';
import ErrorCode from '@domain/shared/error/ErrorCode';
import { StatusCodes } from 'http-status-codes';
import { Schema } from 'joi';

import Koa from 'koa';

const schemaValidator = (schema: Schema) => {
  return async function validationMiddleware(ctx: Koa.Context, next: Koa.Next) {
    try {
      await schema.validateAsync(ctx.request.body, { abortEarly: false });
      return next();
    } catch (error: any) {
      throw new CustomError(
        error.details
          .map((error: any) => error.message.replace(/"/g, ''))
          .join(', '),
        ErrorCode.SCHEMA_VALIDATOR,
        StatusCodes.UNPROCESSABLE_ENTITY,
      );
    }
  };
};

export default schemaValidator;

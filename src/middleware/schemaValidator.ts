import { CustomErrorCodes, StatusCodes } from '@domain/shared/enums';
import CustomError from '@domain/shared/error/CustomError';
import { Schema } from 'joi';

import Koa from 'koa';

const schemaValidator = async (schema: Schema, data: any, next: Koa.Next) => {
  try {
    await schema.validateAsync(data, { abortEarly: false });
    await next();
  } catch (error: any) {
    throw new CustomError(
      error.details
        .map((error: any) => error.message.replace(/"/g, ''))
        .join(', '),
      CustomErrorCodes.SCHEMA_VALIDATOR,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
};

export const bodyValidator = (schema: Schema) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    return schemaValidator(schema, ctx.request.body, next);
  };
};

export const queryValidator = (schema: Schema) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    return schemaValidator(schema, ctx.query, next);
  };
};

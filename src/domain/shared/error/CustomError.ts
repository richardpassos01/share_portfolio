import {ReasonPhrases, StatusCodes} from 'http-status-codes';
import * as Joi from 'joi';
import ErrorCode from './ErrorCode';

export default class CustomError extends Error {
  error?: Joi.ValidationError;

  constructor(
    public message: string = ReasonPhrases.BAD_REQUEST,
    public customCode: string = ErrorCode.BAD_REQUEST,
    public status: StatusCodes = StatusCodes.BAD_REQUEST
  ) {
    super();
  }
}
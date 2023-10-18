import { ReasonPhrases, StatusCodes } from '@domain/shared/enums';
import ErrorCode from './ErrorCode';

export default class CustomError extends Error {
  headers?: Record<string, string>;

  constructor(
    public message: string = ReasonPhrases.BAD_REQUEST,
    public customCode: string = ErrorCode.BAD_REQUEST,
    public status: number = StatusCodes.BAD_REQUEST,
  ) {
    super();
  }
}

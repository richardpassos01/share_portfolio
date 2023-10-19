import {
  CustomErrorCodes,
  ReasonPhrases,
  StatusCodes,
} from '@domain/shared/enums';

export default class CustomError extends Error {
  headers?: Record<string, string>;

  constructor(
    public message: string = ReasonPhrases.BAD_REQUEST,
    public customCode: string = CustomErrorCodes.BAD_REQUEST,
    public status: number = StatusCodes.BAD_REQUEST,
  ) {
    super();
  }
}

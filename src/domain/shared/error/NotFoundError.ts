import {
  CustomErrorCodes,
  ReasonPhrases,
  StatusCodes,
} from '@domain/shared/enums';
import CustomError from '@domain/shared/error/CustomError';

export default class NotFoundError extends CustomError {
  customCode = CustomErrorCodes.NOT_FOUND;
  status = StatusCodes.NOT_FOUND;

  constructor(public message: ReasonPhrases) {
    super();
  }
}

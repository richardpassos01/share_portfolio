import {
  CustomErrorCodes,
  ReasonPhrases,
  StatusCodes,
} from '@domain/shared/enums';
import CustomError from '@domain/shared/error/CustomError';

export default class NotFoundError extends CustomError {
  constructor(private readonly reasonPhrase: ReasonPhrases) {
    super();
  }

  customCode = CustomErrorCodes.NOT_FOUND;
  message = this.reasonPhrase;
  status = StatusCodes.NOT_FOUND;
}

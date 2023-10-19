export enum TRANSACTION_TYPE {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum TRANSACTION_CATEGORY {
  TRADE = 'TRADE',
  DIVIDENDS = 'DIVIDENDS',
  SPLIT = 'SPLIT',
  BONUS_SHARE = 'BONUS_SHARE',
  OTHER = 'OTHER',
}

export enum StatusCodes {
  OK = 200,
  NO_CONTENT = 204,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNPROCESSABLE_ENTITY = 422,
  NOT_FOUND = 404,
}

export enum ReasonPhrases {
  OK = 'OK',
  NO_CONTENT = 'No Content',
  CREATED = 'Created',
  BAD_REQUEST = 'Bad Request',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  SHARE_NOT_FOUND = 'Share Not Found',
  TOTAL_BALANCE_NOT_FOUND = 'Share Not Found',
}

export enum CustomErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  SCHEMA_VALIDATOR = 'SCHEMA_VALIDATOR_ERROR',
  NOT_FOUND = 'RESOURCE_NOT_FOUND',
}

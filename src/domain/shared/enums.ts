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
}

export enum ReasonPhrases {
  OK = 'OK',
  NO_CONTENT = 'No Content',
  CREATED = 'Created',
  BAD_REQUEST = 'Bad Request',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
}

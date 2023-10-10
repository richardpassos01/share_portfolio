import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from './enums';

type Transaction = {
  institutionId: string;
  ticketSymbol: string;
  quantity: number;
  unityPrice: number;
  totalCost: number;
  type: TRANSACTION_TYPE;
  category: TRANSACTION_CATEGORY;
};

export type CreateTransactionParams = Transaction & {
  date: string;
};

export type TransactionDTO = Transaction & {
  date: Date;
};

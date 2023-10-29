import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from './enums';

type Transaction = {
  institutionId: string;
  ticketSymbol: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  type: TRANSACTION_TYPE;
  category: TRANSACTION_CATEGORY;
};

export type CreateTransactionParams = {
  ticketSymbol: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  type: TRANSACTION_TYPE;
  category: TRANSACTION_CATEGORY;
  date: string;
};

export type TransactionDTO = Transaction & {
  id?: string;
  date: Date;
};

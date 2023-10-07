import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from './enums';

export type TransactionParams = {
  institutionId: string;
  type: TRANSACTION_TYPE;
  date: Date;
  category: TRANSACTION_CATEGORY;
  ticketSymbol: string;
  quantity: number;
  unityPrice: number;
  totalCost: number;
};

import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from './enums';

export interface AbstractTransaction {
  institutionId: string;
  type: TRANSACTION_TYPE;
  date: Date;
  category: TRANSACTION_CATEGORY;
  ticketSymbol: string;
  quantity: number;
  unityPrice: number;
  totalCost: number;
  id?: string;
}

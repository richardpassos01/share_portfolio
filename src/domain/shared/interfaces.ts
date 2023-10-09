import { TransactionDTO } from './types';

export interface AbstractTransaction extends TransactionDTO {
  id?: string;
}

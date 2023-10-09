import { TransactionParams } from './types';

export interface AbstractTransaction extends TransactionParams {
  id?: string;
}

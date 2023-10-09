import { TransactionDTO } from '@domain/shared/types';

export default interface AbstractTransaction extends TransactionDTO {
  id?: string;
}

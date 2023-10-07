import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from './enums';

export interface AbstractTransaction {
  getId(): string;
  getInstitutionId(): string;
  getType(): TRANSACTION_TYPE;
  getDate(): Date;
  getCategory(): TRANSACTION_CATEGORY;
  getTicketSymbol(): string;
  getQuantity(): number;
  getUnityPrice(): number;
  getTotalCost(): number;
}

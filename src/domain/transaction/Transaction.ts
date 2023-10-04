import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '@domain/shared/constants';
import { AbstractTransaction } from '@domain/shared/interfaces';
import { uuid } from 'uuidv4';

export default class Transaction implements AbstractTransaction {
  constructor(
    private readonly institutionId: string,
    private readonly type: TRANSACTION_TYPE,
    private readonly date: Date,
    private readonly category: TRANSACTION_CATEGORY,
    private readonly ticketSymbol: string,
    private readonly quantity: number,
    private readonly unityPrice: number,
    private readonly totalCost: number,
    private readonly id: string = uuid(),
  ) {}

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getType() {
    return this.type;
  }

  getDate() {
    return this.date;
  }

  getCategory() {
    return this.category;
  }

  getTicketSymbol() {
    return this.ticketSymbol;
  }

  getQuantity() {
    return this.quantity;
  }

  getUnityPrice() {
    return this.unityPrice;
  }

  getTotalCost() {
    return this.totalCost;
  }
}

import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { v4 as uuid } from 'uuid';

export default class Transaction {
  constructor(
    public readonly institutionId: string,
    public readonly type: TRANSACTION_TYPE,
    public readonly date: Date,
    public readonly category: TRANSACTION_CATEGORY,
    public readonly ticketSymbol: string,
    public readonly quantity: number,
    public readonly unityPrice: number,
    public readonly totalCost: number,
    public readonly id: string = uuid(),
  ) {}
}

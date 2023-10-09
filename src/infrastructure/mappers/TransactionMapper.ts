import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import Transaction from '@domain/transaction/Transaction';

type MapToEntityInput = {
  id: string;
  institution_id: string;
  type: TRANSACTION_TYPE;
  date: Date;
  category: TRANSACTION_CATEGORY;
  ticket_symbol: string;
  quantity: number;
  unity_price: number;
  total_cost: number;
};

export default class TransactionMapper {
  static mapToDatabaseObject(entity: Transaction): MapToEntityInput {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      type: entity.type,
      date: entity.date,
      category: entity.category,
      ticket_symbol: entity.ticketSymbol,
      quantity: entity.quantity,
      unity_price: entity.unityPrice,
      total_cost: entity.totalCost,
    };
  }

  static mapToEntity(object: MapToEntityInput): Transaction {
    return new Transaction(
      object.institution_id,
      object.type,
      object.date,
      object.category,
      object.ticket_symbol,
      object.quantity,
      object.unity_price,
      object.total_cost,
      object.id,
    );
  }
}

import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '@domain/shared/constants';
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
      id: entity.getId(),
      institution_id: entity.getInstitutionId(),
      type: entity.getType(),
      date: entity.getDate(),
      category: entity.getCategory(),
      ticket_symbol: entity.getTicketSymbol(),
      quantity: entity.getQuantity(),
      unity_price: entity.getUnityPrice(),
      total_cost: entity.getTotalCost(),
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

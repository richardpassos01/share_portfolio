import Transaction from '../../domain/transaction/Transaction';

export default class TransactionMapper {
  static mapToDatabaseObject(entity) {
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

  static mapToEntity(object) {
    return new Transaction({
      id: object.id,
      institutionId: object.institution_id,
      type: object.type,
      date: object.date,
      category: object.category,
      ticketSymbol: object.ticket_symbol,
      quantity: object.quantity,
      unityPrice: object.unity_price,
      totalCost: object.total_cost,
    });
  }
}
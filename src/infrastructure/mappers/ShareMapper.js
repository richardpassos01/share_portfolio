import Share from '../../domain/share/Share.js';

export default class ShareMapper {
  static mapToDatabaseObject(entity) {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      ticket_symbol: entity.ticketSymbol,
      quantity: entity.quantity,
      total_cost: entity.totalCost,
      medium_price: entity.mediumPrice,
    };
  }

  static mapToEntity(object) {
    return new Share({
      id: object.id,
      institutionId: object.institution_id,
      ticketSymbol: object.ticket_symbol,
      quantity: object.quantity,
      totalCost: Number(object.total_cost),
      mediumPrice: Number(object.medium_price),
    });
  }
}

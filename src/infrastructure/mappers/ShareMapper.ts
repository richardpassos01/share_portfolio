import Share from '../../domain/share/Share';

export default class ShareMapper {
  static mapToDatabaseObject(entity) {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      ticket_symbol: entity.ticketSymbol,
      quantity: entity.quantity,
      total_cost: entity.totalCost,
    };
  }

  static mapToEntity(object) {
    return new Share({
      id: object.id,
      institutionId: object.institution_id,
      ticketSymbol: object.ticket_symbol,
      quantity: object.quantity,
      totalCost: object.total_cost,
    });
  }
}

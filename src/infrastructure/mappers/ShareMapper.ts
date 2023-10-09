import Share from '@domain/share/Share';

type MapToEntityInput = {
  id: string;
  institution_id: string;
  ticket_symbol: string;
  quantity: number;
  total_cost: number;
};

export default class ShareMapper {
  static mapToDatabaseObject(entity: Share): MapToEntityInput {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      ticket_symbol: entity.ticketSymbol,
      quantity: entity.quantity,
      total_cost: entity.totalCost,
    };
  }

  static mapToEntity(object: MapToEntityInput): Share {
    return new Share(
      object.institution_id,
      object.ticket_symbol,
      object.quantity,
      object.total_cost,
      object.id,
    );
  }
}

import Balance from '../../domain/transaction/balance/Balance.js';

export default class BalanceMapper {
  static mapToDatabaseObject(entity) {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      year_month: entity.yearMonth,
      wins: entity.wins,
      loss: entity.loss,
      taxes: entity.taxes,
      type: entity.type,
    };
  }

  static mapToEntity(object) {
    return new Balance({
      id: object.id,
      institutionId: object.institution_id,
      yearMonth: object.year_month,
      wins: object.wins,
      loss: object.loss,
      taxes: object.taxes,
      type: object.type,
    });
  }
}

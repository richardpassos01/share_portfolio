import MonthlyBalance from '../../domain/transaction/balance/MonthlyBalance.js';

export default class MonthlyBalanceMapper {
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
    return new MonthlyBalance({
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

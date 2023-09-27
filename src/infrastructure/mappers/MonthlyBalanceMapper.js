import MonthlyBalance from '../../domain/monthlyBalance/MonthlyBalance.js';

export default class MonthlyBalanceMapper {
  static mapToDatabaseObject(entity) {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      year_month: entity.yearMonth,
      gross_wins: entity.grossWins,
      loss: entity.loss,
      taxes: entity.taxes,
      net_wins: entity.netWins,
      type: entity.type,
    };
  }

  static mapToEntity(object) {
    return new MonthlyBalance({
      id: object.id,
      institutionId: object.institution_id,
      yearMonth: object.year_month,
      grossWins: object.gross_wins,
      loss: object.loss,
      taxes: object.taxes,
      netWins: object.net_wins,
      type: object.type,
    });
  }
}

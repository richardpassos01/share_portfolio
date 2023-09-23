import Institution from '../../domain/institution/Institution.js';

export default class InstitutionMapper {
  static mapToDatabaseObject(entity) {
    return {
      id: entity.id,
      name: entity.name,
      user_id: entity.userId,
      total_loss: entity.totalLoss,
      total_wins: entity.totalWins,
    };
  }

  static mapToEntity(object) {
    return new Institution({
      id: object.id,
      name: object.name,
      userId: object.user_id,
      totalLoss: Number(object.total_loss),
      totalWins: Number(object.total_wins),
    });
  }
}

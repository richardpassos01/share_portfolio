import TotalBalance from '../../domain/totalBalance/TotalBalance';

export default class TotalBalanceMapper {
  static mapToDatabaseObject(entity) {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      loss: entity.loss,
    };
  }

  static mapToEntity(object) {
    return new TotalBalance({
      id: object.id,
      institutionId: object.institution_id,
      loss: object.loss,
    });
  }
}

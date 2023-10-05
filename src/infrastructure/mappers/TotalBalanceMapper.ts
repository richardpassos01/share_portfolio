import TotalBalance from '@domain/totalBalance/TotalBalance';

type MapToEntityInput = {
  id: string;
  institution_id: string;
  loss: number;
};

export default class TotalBalanceMapper {
  static mapToDatabaseObject(entity: TotalBalance): MapToEntityInput {
    return {
      id: entity.getId(),
      institution_id: entity.getInstitutionId(),
      loss: entity.getLoss(),
    };
  }

  static mapToEntity(object: MapToEntityInput): TotalBalance {
    return new TotalBalance(object.institution_id, object.loss, object.id);
  }
}

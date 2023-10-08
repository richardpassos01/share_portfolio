import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';

type MapToEntityInput = {
  id: string;
  institution_id: string;
  loss: number;
};

export default class TotalBalanceMapper {
  static mapToDatabaseObject(entity: TotalBalance): MapToEntityInput {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      loss: entity.loss,
    };
  }

  static mapToEntity(object: MapToEntityInput): TotalBalance {
    return new TotalBalance(object.institution_id, 0, object.loss, object.id);
  }
}

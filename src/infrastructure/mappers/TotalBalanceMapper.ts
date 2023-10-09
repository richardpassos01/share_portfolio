import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';

type MapToEntityInput = {
  institution_id: string;
  loss: number;
};

export default class TotalBalanceMapper {
  static mapToDatabaseObject(entity: TotalBalance): MapToEntityInput {
    return {
      institution_id: entity.institutionId,
      loss: entity.loss,
    };
  }

  static mapToEntity(object: MapToEntityInput): TotalBalance {
    return new TotalBalance(object.institution_id, object.loss);
  }
}

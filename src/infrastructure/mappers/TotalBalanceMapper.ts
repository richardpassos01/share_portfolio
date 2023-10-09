import TotalBalance from '@domain/financialReport/totalBalance/TotalBalance';

type MapToEntityInput = {
  institution_id: string;
  earning: number;
  loss: number;
};

export default class TotalBalanceMapper {
  static mapToDatabaseObject(entity: TotalBalance): MapToEntityInput {
    return {
      institution_id: entity.institutionId,
      earning: entity.earning,
      loss: entity.loss,
    };
  }

  static mapToEntity(object: MapToEntityInput): TotalBalance {
    return new TotalBalance(object.institution_id, object.earning, object.loss);
  }
}

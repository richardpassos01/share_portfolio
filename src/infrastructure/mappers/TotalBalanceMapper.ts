import TotalBalance from '@domain/balance/totalBalance/TotalBalance';

type MapToEntityInput = {
  institution_id: string;
  loss: number;
  net_earning: number;
};

export default class TotalBalanceMapper {
  static mapToDatabaseObject(entity: TotalBalance): MapToEntityInput {
    return {
      institution_id: entity.institutionId,
      loss: entity.loss,
      net_earning: entity.netEarning,
    };
  }

  static mapToEntity(object: MapToEntityInput): TotalBalance {
    return new TotalBalance(
      object.institution_id,
      object.loss,
      object.net_earning,
    );
  }
}

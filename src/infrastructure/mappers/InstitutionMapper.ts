import Institution from '@domain/institution/Institution';

type MapToEntityInput = {
  id: string;
  name: string;
  user_id: string;
};

export default class InstitutionMapper {
  static mapToDatabaseObject(entity: Institution): MapToEntityInput {
    return {
      id: entity.getId(),
      name: entity.getName(),
      user_id: entity.getUserId(),
    };
  }

  static mapToEntity({ id, name, user_id }: MapToEntityInput): Institution {
    return new Institution(
      id,
      name,
      user_id,
    );
  }
}

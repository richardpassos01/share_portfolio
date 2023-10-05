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

  static mapToEntity(object: MapToEntityInput): Institution {
    return new Institution(object.name, object.user_id, object.id);
  }
}

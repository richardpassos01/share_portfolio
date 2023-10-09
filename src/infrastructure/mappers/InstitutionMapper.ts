import Institution from '@domain/institution/Institution';

type MapToEntityInput = {
  id: string;
  name: string;
  user_id: string;
};

export default class InstitutionMapper {
  static mapToDatabaseObject(entity: Institution): MapToEntityInput {
    return {
      id: entity.id,
      name: entity.name,
      user_id: entity.userId,
    };
  }

  static mapToEntity(object: MapToEntityInput): Institution {
    return new Institution(object.name, object.user_id, object.id);
  }
}

import InstitutionMapper from '@infrastructure/mappers/InstitutionMapper';
import { TYPES } from '@constants/types';
import Database, { TABLES } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import Institution from '@domain/institution/Institution';

@injectable()
export default class InstitutionRepository
  implements InstitutionRepositoryInterface
{
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database,
  ) {}

  async list(userId: string) {
    return this.database
      .connection()
      .select()
      .where('user_id', userId)
      .into(TABLES.INSTITUTION)
      .then(
        (data) =>
          data?.map((institution) =>
            InstitutionMapper.mapToEntity(institution),
          ),
      );
  }

  async create(institution: Institution) {
    await this.database
      .connection()
      .insert(InstitutionMapper.mapToDatabaseObject(institution))
      .into(TABLES.INSTITUTION);
  }
}

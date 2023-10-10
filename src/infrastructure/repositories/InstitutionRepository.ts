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

  async get(institutionId: string) {
    return this.database
      .connection()
      .select()
      .where('id', institutionId)
      .into(TABLES.INSTITUTION)
      .first()
      .then((data) => InstitutionMapper.mapToEntity(data));
  }

  async create(institution: Institution) {
    await this.database
      .connection()
      .insert(InstitutionMapper.mapToDatabaseObject(institution))
      .into(TABLES.INSTITUTION);
  }
}

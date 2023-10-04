import InstitutionMapper from '@infrastructure/mappers/InstitutionMapper';
import {TYPES} from '@constants/types';
import Database, {Tables} from '@infrastructure/database';
import {inject, injectable} from 'inversify';
import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';

@injectable()
export default class InstitutionRepository implements InstitutionRepositoryInterface  {
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database
  ) {}

  async get(institutionId: string) {
    return this.database
      .connection()
      .select()
      .where('id', institutionId)
      .into(Tables.INSTITUTION)
      .first()
      .then((data) => InstitutionMapper.mapToEntity(data));
  }
}

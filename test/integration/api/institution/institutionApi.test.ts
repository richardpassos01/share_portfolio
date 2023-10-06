import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { StatusCodes } from 'http-status-codes';
import InstitutionFactory from '@factories/InstitutionFactory';

describe('institutionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);

    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    server.close();
  });

  describe('GET /institution', () => {
    it('should retrive institution', async () => {
      const institution = new InstitutionFactory().getObject();

      const response = await request.get(`/institution/${institution.id}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(institution);
    });
  });
});

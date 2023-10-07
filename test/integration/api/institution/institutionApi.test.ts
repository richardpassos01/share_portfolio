import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import InstitutionFactory from '@factories/InstitutionFactory';
import institution from '@fixtures/institution';

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

  describe('POST /institution', () => {
    it('should create institution', async () => {
      const payload = new InstitutionFactory().getPayloadObject();

      const response = await request.post('/institution').send(payload);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.text).toBe(ReasonPhrases.CREATED);
    });
  });

  describe('GET /institution/:institutionId', () => {
    it('should get institution', async () => {
      const institution = new InstitutionFactory().getObject();

      const response = await request.get(`/institution/${institution.id}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(institution);
    });
  });

  describe('GET /institution/:institutionId/profit', () => {
    it('should get institution balance', async () => {
      const expectedBalance = { loss: 0, profit: 0 };

      const response = await request.get(
        `/institution/${institution.id}/balance`,
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(expectedBalance).toEqual(response.body);
    });
  });
});

import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { StatusCodes } from 'http-status-codes';
import InstitutionFactory from '@factories/InstitutionFactory';
import institution from '@fixtures/institution';
import GetInstitution from '@application/queries/GetInstitution';

describe('institutionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let getInstitution: GetInstitution;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    getInstitution = container.get<GetInstitution>(TYPES.GetInstitution);

    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    server.close();
  });

  describe('POST /institution', () => {
    describe('When called the endpoint with valid schema', () => {
      it('should create institution', async () => {
        const payload = new InstitutionFactory().getPayloadObject();

        const response = await request.post('/institution').send(payload);

        const institution = await getInstitution.execute(response.body.id);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(institution).toBeTruthy();
      });
    });

    describe('When called the endpoint with invalid schema', () => {
      it('should throw unprocessable entity error', async () => {
        await request
          .post('/institution')
          .send()
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      });
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

import { v4 as uuid } from 'uuid';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import InstitutionFactory from '@factories/InstitutionFactory';
import ListInstitutions from '@application/queries/ListInstitutions';
import { StatusCodes } from '@domain/shared/enums';

describe('institutionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let listInstitutions: ListInstitutions;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    listInstitutions = container.get<ListInstitutions>(TYPES.ListInstitutions);
  });

  beforeEach(async () => {
    await database.connection().migrate.rollback();
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
        const payload = new InstitutionFactory().getCreatePayload();

        const response = await request.post('/institution').send(payload);

        const [institution] = await listInstitutions.execute(payload.userId);

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

  describe('GET /institutions/:userId', () => {
    it('should list institutions', async () => {
      const institution = new InstitutionFactory({ id: uuid() }).get();

      const response = await request.get(`/institutions/${institution.userId}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBe(1);
    });
  });
});

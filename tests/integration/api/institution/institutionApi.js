import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../../../src/api/app';
import InstitutionFactory from '../../../factories/InstitutionFactory.js';
import { database } from '../../../../src/DependencyInjectionContainer';

describe('institutionAPI', () => {
  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
  });

  afterAll(async () => {
    await database.connection().destroy();
  });

  describe('GET /institution', () => {
    it('should retrive institution', async () => {
      const institution = new InstitutionFactory().getObject();

      const response = await request(app).get(`/institution/${institution.id}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(institution);
    });
  });
});

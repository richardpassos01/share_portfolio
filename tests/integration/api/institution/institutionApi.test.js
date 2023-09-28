import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { database } from '../../../../src/DependencyInjectionContainer';
import app from '../../../../src/api/app';
import InstitutionFactory from '../../../factories/InstitutionFactory.js';

describe('institutionAPI', () => {
  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();
  });

  describe('GET /institution', () => {
    it('should retrive institution', async () => {
      const response = await request(app).get(
        '/institution/c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
      );
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(new InstitutionFactory().getObject());
    });
  });
});

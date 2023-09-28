import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { database } from '../../../../src/DependencyInjectionContainer';
import app from '../../../../src/api/app';
import TransactionFactory from '../../../factories/transactionFactory.js';

describe('transactionAPI', () => {
  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();
  });

  describe('POST /transaction', () => {
    it('should create transaction and update portifolio', async () => {
      const transaction = new TransactionFactory();
      const response = await request(app)
        .post('/transaction')
        .send(transaction.getObject());

      expect(response.status).toBe(StatusCodes.OK);
    });
  });
});

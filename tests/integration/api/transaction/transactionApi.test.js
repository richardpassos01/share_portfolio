import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import {
  database,
  transactionRepository,
  shareRepository,
} from '../../../../src/DependencyInjectionContainer';
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
    describe('when you purchase shares for the first time', () => {
      it('should create transaction and share record', async () => {
        const payload = new TransactionFactory();
        const response = await request(app)
          .post('/transaction')
          .send(payload.getObject());

        const [transaction] = await transactionRepository.get(
          payload.get().institutionId,
        );
        const share = await shareRepository.get(
          payload.get().ticketSymbol,
          payload.get().institutionId,
        );

        expect(response.status).toBe(StatusCodes.OK);
        expect(payload.get().ticketSymbol).toEqual(transaction.ticketSymbol);
        expect(share.ticketSymbol).toBe(payload.get().ticketSymbol);
      });
    });
  });
});

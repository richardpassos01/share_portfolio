import request from 'supertest';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
  database,
  transactionRepository,
  shareRepository,
  monthlyBalanceRepository,
} from '../../../../src/DependencyInjectionContainer';
import app from '../../../../src/api/app';
import TransactionFactory from '../../../factories/transactionFactory.js';
import ShareFactory from '../../../factories/shareFactory.js';

describe('transactionAPI', () => {
  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
  });

  describe('POST /transaction', () => {
    it('should return status and reason OK', async () => {
      const payload = new TransactionFactory().getPayloadObject();

      const response = await request(app).post('/transaction').send(payload);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toBe(ReasonPhrases.OK);
    });

    it('should create transaction', async () => {
      const transaction = new TransactionFactory();
      const payload = transaction.getPayloadObject();
      const expectedTransaction = transaction.getObject();

      await request(app).post('/transaction').send(payload);

      const [{ id, ...result }] = await transactionRepository.get(
        payload.institutionId,
      );

      expect(expectedTransaction).toEqual(result);
    });

    describe('when the transaction is of type BUY', () => {
      it('should create share if it not exists', async () => {
        const payload = new TransactionFactory().getPayloadObject();
        const expectedShare = new ShareFactory().getObject();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await shareRepository.get(
          payload.ticketSymbol,
          payload.institutionId,
        );

        expect(expectedShare).toEqual(result);
      });

      // it('should update share if it already exists', async () => {
      //   const payload = new TransactionFactory().getPayloadObject();
      //   const share = new ShareFactory();
      //   await share.save();

      //   const { id, ...result } = await shareRepository.get(
      //     payload.ticketSymbol,
      //     payload.institutionId,
      //   );

      //   console.log(result);

      //   const expectedShare = new ShareFactory({
      //     quantity: 200,
      //     totalCost: 20000,
      //   }).getObject();

      //   expect(expectedShare).toEqual(result);
      // });

      // it('should create monthly balance if not exists', async () => {
      //   const payload = new TransactionFactory().getPayloadObject();
      //   const expectedMonthlyBalance = {};

      //   await request(app).post('/transaction').send(payload);

      //   const { id, ...monthlyBalance } = await monthlyBalanceRepository.get(
      //     payload.ticketSymbol,
      //     payload.institutionId,
      //   );

      //   expect(expectedMonthlyBalance).toEqual(monthlyBalance);
      // });
    });
  });
});

import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import TransactionFactory from '@factories/TransactionFactory';
import ListTransactions from '@application/useCases/ListTransactions';

describe('transactionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let listTransactions: ListTransactions;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    listTransactions = container.get<ListTransactions>(TYPES.ListTransactions);
  });

  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    server.close();
  });

  describe('POST /transaction', () => {
    it('should return status and text CREATED', async () => {
      const payload = new TransactionFactory().getPayloadObject();

      const response = await request.post('/transaction').send(payload);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.text).toBe(ReasonPhrases.CREATED);
    });

    it('should create transaction', async () => {
      const transaction = new TransactionFactory();
      const payload = transaction.getPayloadObject();
      const expectedTransaction = transaction.getObject();

      await request.post('/transaction').send(payload);

      const [result] = await listTransactions.execute(payload.institutionId);

      expect(expectedTransaction).toEqual(
        new TransactionFactory({}, result).getObject(),
      );
    });
  });
});

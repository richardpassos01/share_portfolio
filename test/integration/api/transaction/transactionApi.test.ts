import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import TransactionFactory from '@factories/TransactionFactory';
import ShareFactory from '@factories/ShareFactory';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import { dateToMonthYear } from '@helpers';

describe('transactionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let shareRepository: ShareRepository;
  let monthlyBalanceRepository: MonthlyBalanceRepository;
  let transactionRepository: TransactionRepository;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    shareRepository = container.get<ShareRepository>(TYPES.ShareRepository);
    monthlyBalanceRepository = container.get<MonthlyBalanceRepository>(
      TYPES.MonthlyBalanceRepository,
    );
    transactionRepository = container.get<TransactionRepository>(
      TYPES.TransactionRepository,
    );
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

      const response = await request
        .post('/transaction')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.text).toBe(ReasonPhrases.CREATED);
    });

    it('should create transaction', async () => {
      const transaction = new TransactionFactory();
      const payload = transaction.getPayloadObject();
      const expectedTransaction = transaction.getObject();

      await request.post('/transaction').send(payload);

      const [result] = await transactionRepository.get(payload.institutionId);

      expect(expectedTransaction).toEqual(
        new TransactionFactory({}, result).getObject(),
      );
    });

    it('should create monthly balance if not exists', async () => {
      const factory = new TransactionFactory();
      const transaction = factory.get();
      const payload = factory.getPayloadObject();
      const expectedMonthlyBalance = new MonthlyBalanceFactory().getObject();

      await request.post('/transaction').send(payload);

      const result = await monthlyBalanceRepository.get(
        transaction.getInstitutionId(),
        dateToMonthYear(transaction.getDate()),
      );

      expect(expectedMonthlyBalance).toEqual(
        new MonthlyBalanceFactory({}, result).getObject(),
      );
    });

    it('Should create the Share if it does not exist, when creating a BUY transaction', async () => {
      const payload = new TransactionFactory().getPayloadObject();
      const expectedShare = new ShareFactory().getObject();

      await request.post('/transaction').send(payload);

      const result = await shareRepository.get(
        payload.institutionId,
        payload.ticketSymbol,
      );

      expect(expectedShare).toEqual(new ShareFactory({}, result).getObject());
    });
  });
});

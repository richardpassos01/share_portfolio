import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import institution from '@fixtures/institution';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import { StatusCodes } from '@domain/shared/enums';
import TotalBalanceRepositoryInterface from '@domain/balance/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';

describe('MonthlyBalanceApi', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let totalBalanceRepository: TotalBalanceRepositoryInterface;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    totalBalanceRepository = container.get<TotalBalanceRepositoryInterface>(
      TYPES.TotalBalanceRepository,
    );

    await database.connection().migrate.latest();
    await database.connection().seed.run();
    await totalBalanceRepository.createOrUpdate(
      new TotalBalanceFactory().get(),
    );
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    server.close();
  });

  describe('GET /monthly-balance', () => {
    it('should get monthly balance', async () => {
      const monthlyBalance = new MonthlyBalanceFactory();
      await monthlyBalance.save();
      const expectedResponse = monthlyBalance.getObject();

      const response = await request
        .get(`/monthly-balance/${institution.id}`)
        .send({ yearMonth: monthlyBalance.get().yearMonth });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('GET /monthly-balances', () => {
    it('should list monthly balances', async () => {
      const monthlyBalance = new MonthlyBalanceFactory();
      await monthlyBalance.save();
      const expectedResponse = [monthlyBalance.getObject()];

      const response = await request
        .get(`/monthly-balances/${institution.id}`)
        .send({ yearMonth: monthlyBalance.get().yearMonth });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(expectedResponse);
    });
  });
});

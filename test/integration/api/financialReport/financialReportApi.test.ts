import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { StatusCodes } from 'http-status-codes';
import institution from '@fixtures/institution';
import CreateOrUpdateTotalBalance from '@application/useCases/CreateOrUpdateTotalBalance';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';

describe('financialReportAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let createOrUpdateTotalBalance: CreateOrUpdateTotalBalance;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createOrUpdateTotalBalance = container.get<CreateOrUpdateTotalBalance>(
      TYPES.CreateOrUpdateTotalBalance,
    );

    await database.connection().migrate.latest();
    await database.connection().seed.run();
    await createOrUpdateTotalBalance.execute(new TotalBalanceFactory().get());
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    server.close();
  });

  describe('GET /financial_report', () => {
    it('should get institution balance', async () => {
      const expectedResponse = {
        institutionId: institution.id,
        earning: 0,
        loss: 0,
      };

      const response = await request.get(
        `/financial_report/${institution.id}/total_balance`,
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(expectedResponse).toEqual(response.body);
    });
  });
});

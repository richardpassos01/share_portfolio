import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import institution from '@fixtures/institution';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import { StatusCodes } from '@domain/shared/enums';
import TotalBalanceRepositoryInterface from '@domain/balance/totalBalance/interfaces/TotalBalanceRepositoryInterface';

describe('TotalBalanceApiAPI', () => {
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

  describe('GET /total-balance', () => {
    it('should get total balance', async () => {
      const expectedResponse = {
        institutionId: institution.id,
        netEarning: 0,
        loss: 0,
      };

      const response = await request.get(`/total-balance/${institution.id}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(expectedResponse);
    });
  });
});

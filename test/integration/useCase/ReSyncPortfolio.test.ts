import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import ListShares from '@application/queries/ListShares';
import ListMonthlyBalance from '@application/queries/ListMonthlyBalance';
import institution from '@fixtures/institution';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';
import { transactionsParams } from '@fixtures/transactions';
import { listMonthlyBalances } from '@fixtures/monthlyBalances';
import TransactionFactory from '@factories/TransactionFactory';
import { shares } from '@fixtures/shares';
import { totalBalances } from '@fixtures/totalBalances';
import GetTotalBalance from '@application/queries/GetTotalBalance';

describe('ReSyncPortfolio', () => {
  let database: Database;
  let listShares: ListShares;
  let listMonthlyBalance: ListMonthlyBalance;
  let reSyncPortfolio: ReSyncPortfolio;
  let getTotalBalance: GetTotalBalance;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    listShares = container.get<ListShares>(TYPES.ListShares);
    listMonthlyBalance = container.get<ListMonthlyBalance>(
      TYPES.ListMonthlyBalance,
    );
    getTotalBalance = container.get<GetTotalBalance>(TYPES.GetTotalBalance);
    reSyncPortfolio = container.get<ReSyncPortfolio>(TYPES.ReSyncPortfolio);
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();
  });

  describe('when call use case', () => {
    it('should reset the portfolio and recreate information based on transactions, no matter the order in which the transactions were created.', async () => {
      const expectedShare = shares[shares.length - 1];
      const expectedTotalBalance = totalBalances[totalBalances.length - 1];
      const expectedMonthlyBalances = listMonthlyBalances();

      transactionsParams.sort(() => Math.random() - 0.5);

      for (const transaction of transactionsParams) {
        await new TransactionFactory(transaction).save();
      }

      await reSyncPortfolio.execute(institution.id);

      const sharesList = (await listShares.execute(institution.id)).map(
        (share) => new ShareFactory({}, share).getObject(),
      );
      const monthlyBalanceList = (
        await listMonthlyBalance.execute(institution.id)
      ).map((monthlyBalance) =>
        new MonthlyBalanceFactory({}, monthlyBalance).getObject(),
      );
      const totalBalance = await getTotalBalance.execute(institution.id);

      expect(monthlyBalanceList).toEqual(expectedMonthlyBalances);
      expect(totalBalance).toEqual(expectedTotalBalance);
      expect(sharesList).toEqual(expectedShare);
    });
  });
});

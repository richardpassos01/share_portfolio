import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import ListShares from '@application/queries/ListShares';
import ListMonthlyBalance from '@application/queries/ListMonthlyBalance';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import institution from '@fixtures/institution';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';
import { transactionsParams } from '@fixtures/transactions';
import { monthlyBalances } from '@fixtures/monthlyBalances';
import { totalBalances } from '@fixtures/totalBalances';
import TransactionFactory from '@factories/TransactionFactory';
import { shares } from '@fixtures/shares';

describe('ReSyncPortfolio', () => {
  let database: Database;
  let listShares: ListShares;
  let listMonthlyBalance: ListMonthlyBalance;
  let getTotalBalance: GetTotalBalance;
  let reSyncPortfolio: ReSyncPortfolio;

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
      const expectedMonthlyBalances = monthlyBalances.filter(
        (current, index, array) => {
          if (index === array.length - 1) {
            return true;
          }
          return current.yearMonth !== array[index + 1].yearMonth;
        },
      );
      const randomSortedTransactions = transactionsParams.sort(
        () => Math.random() - 0.5,
      );
      for (const transaction of randomSortedTransactions) {
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
      const totalBalance = new TotalBalanceFactory(
        {},
        await getTotalBalance.execute(institution.id),
      ).getObject();
      expect(monthlyBalanceList).toEqual(expectedMonthlyBalances);
      expect(totalBalance).toEqual(expectedTotalBalance);
      expect(sharesList).toEqual(expectedShare);
    });
  });
});

import 'reflect-metadata';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import CreateTransactions from '@application/useCases/CreateTransactions';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import ListShares from '@application/queries/ListShares';
import ListMonthlyBalance from '@application/queries/ListMonthlyBalance';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import CalculateTotalBalanceEarning from '@application/useCases/CalculateTotalBalanceEarning';
import institution from '@fixtures/institution';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';
import { transactions } from '@fixtures/transactions';
import { monthlyBalances } from '@fixtures/monthlyBalances';
import { totalBalances } from '@fixtures/totalBalances';
import TransactionFactory from '@factories/TransactionFactory';

describe('ReSyncPortfolio', () => {
  let database: Database;
  let createTransactions: CreateTransactions;
  let listShares: ListShares;
  let listMonthlyBalance: ListMonthlyBalance;
  let getTotalBalance: GetTotalBalance;
  let calculateTotalBalanceEarning: CalculateTotalBalanceEarning;
  let reSyncPortfolio: ReSyncPortfolio;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createTransactions = container.get<CreateTransactions>(
      TYPES.CreateTransactions,
    );
    listShares = container.get<ListShares>(TYPES.ListShares);
    listMonthlyBalance = container.get<ListMonthlyBalance>(
      TYPES.ListMonthlyBalance,
    );
    getTotalBalance = container.get<GetTotalBalance>(TYPES.GetTotalBalance);
    calculateTotalBalanceEarning = container.get<CalculateTotalBalanceEarning>(
      TYPES.CalculateTotalBalanceEarning,
    );
    reSyncPortfolio = container.get<ReSyncPortfolio>(TYPES.ReSyncPortfolio);
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();
  });

  describe('when call use case', () => {
    it('Should reset portfolio and recreate informations based on transactions', async () => {
      const expectedMonthlyBalances = monthlyBalances.filter(
        (current, index, array) => {
          if (index === array.length - 1) {
            return true;
          }
          return current.yearMonth !== array[index + 1].yearMonth;
        },
      );

      for (const transaction of transactions) {
        await new TransactionFactory(transaction).save();
      }

      await reSyncPortfolio.execute(institution.id);

      const monthlyBalanceList = (
        await listMonthlyBalance.execute(institution.id)
      ).map((monthlyBalance) =>
        new MonthlyBalanceFactory({}, monthlyBalance).getObject(),
      );
      const totalBalance = await getTotalBalance.execute(institution.id);

      expect(expectedMonthlyBalances).toEqual(monthlyBalanceList);
      expect(totalBalances[totalBalances.length - 1]).toEqual(
        new TotalBalanceFactory({}, totalBalance).getObject(),
      );
    });
  });
});

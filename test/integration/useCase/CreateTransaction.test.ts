import 'reflect-metadata';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { createTransactionCases } from '@fixtures/cases';
import CreateTransactions from '@application/useCases/CreateTransactions';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import ListShares from '@application/queries/ListShares';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import CalculateTotalBalanceEarning from '@application/useCases/CalculateTotalBalanceEarning';
import institution from '@fixtures/institution';

describe('CreateTransactions', () => {
  let database: Database;
  let createTransactions: CreateTransactions;
  let listShares: ListShares;
  let getMonthlyBalance: GetMonthlyBalance;
  let getTotalBalance: GetTotalBalance;
  let calculateTotalBalanceEarning: CalculateTotalBalanceEarning;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createTransactions = container.get<CreateTransactions>(
      TYPES.CreateTransactions,
    );
    listShares = container.get<ListShares>(TYPES.ListShares);
    getMonthlyBalance = container.get<GetMonthlyBalance>(
      TYPES.GetMonthlyBalance,
    );
    getTotalBalance = container.get<GetTotalBalance>(TYPES.GetTotalBalance);
    calculateTotalBalanceEarning = container.get<CalculateTotalBalanceEarning>(
      TYPES.CalculateTotalBalanceEarning,
    );
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();
  });

  describe.each(createTransactionCases)(
    'when call use case',
    (
      transactionParams,
      expectedShare,
      expectedMonthlyBalance,
      expectedTotalBalance,
      description,
    ) => {
      it(description, async () => {
        await createTransactions.execute([transactionParams]);

        const shares = await listShares.execute(institution.id);

        const monthlyBalance = await getMonthlyBalance.execute(
          institution.id,
          new Date(`${transactionParams.date}T00:00:00`),
        );

        const totalBalance = await getTotalBalance.execute(institution.id);

        expect(
          shares.map((share) => new ShareFactory({}, share).getObject()),
        ).toEqual(expectedShare);
        expect(
          new MonthlyBalanceFactory({}, monthlyBalance).getObject(),
        ).toEqual(expectedMonthlyBalance);
        expect(new TotalBalanceFactory({}, totalBalance).getObject()).toEqual(
          expectedTotalBalance,
        );
      });
    },
  );

  describe('after call use case ', () => {
    it('Should update total balance loss and leave it prepared to return total earning', async () => {
      const expectedBalanceEarning = 1721816.1419294872;

      const balance = await calculateTotalBalanceEarning.execute(
        institution.id,
      );

      expect(balance.earning).toEqual(expectedBalanceEarning);
    });
  });
});

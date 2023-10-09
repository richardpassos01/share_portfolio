import 'reflect-metadata';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { createTransactionCases } from '@fixtures/cases';
import CreateTransaction from '@application/useCases/CreateTransaction';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import ListShares from '@application/queries/ListShares';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import CalculateTotalBalanceEarning from '@application/useCases/CalculateTotalBalanceEarning';
import institution from '@fixtures/institution';

describe('CreateTransaction', () => {
  let database: Database;
  let createTransaction: CreateTransaction;
  let listShares: ListShares;
  let getMonthlyBalance: GetMonthlyBalance;
  let getTotalBalance: GetTotalBalance;
  let calculateTotalBalanceEarning: CalculateTotalBalanceEarning;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createTransaction = container.get<CreateTransaction>(
      TYPES.CreateTransaction,
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
        await createTransaction.execute([transactionParams]);

        const shares = await listShares.execute(institution.id);

        const monthlyBalance = await getMonthlyBalance.execute(
          institution.id,
          new Date(`${transactionParams.date}T00:00:00`),
        );

        const totalBalance = await getTotalBalance.execute(institution.id);

        expect(expectedShare).toEqual(
          shares.map((share) => new ShareFactory({}, share).getObject()),
        );
        expect(expectedMonthlyBalance).toEqual(
          new MonthlyBalanceFactory({}, monthlyBalance).getObject(),
        );
        expect(expectedTotalBalance).toEqual(
          new TotalBalanceFactory({}, totalBalance).getObject(),
        );
      });
    },
  );

  describe('after call use case ', () => {
    it('Should update total balance loss and leave it prepared to return total earning', async () => {
      const expectedBalanceEarning = 1721806.6940386684;

      const balance = await calculateTotalBalanceEarning.execute(
        institution.id,
      );

      expect(expectedBalanceEarning).toEqual(balance.earning);
    });
  });
});

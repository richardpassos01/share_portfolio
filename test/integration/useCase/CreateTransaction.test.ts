import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { createTransactionCases } from '@fixtures/cases';
import CreateTransactions from '@application/useCases/CreateTransactions';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import ListShares from '@application/queries/ListShares';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import institution from '@fixtures/institution';
import GetTotalBalance from '@application/queries/GetTotalBalance';

describe('CreateTransactions', () => {
  let database: Database;
  let createTransactions: CreateTransactions;
  let listShares: ListShares;
  let getMonthlyBalance: GetMonthlyBalance;
  let getTotalBalance: GetTotalBalance;

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
        await createTransactions.execute(institution.id, [transactionParams]);

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
        expect(totalBalance).toEqual(expectedTotalBalance);
      });
    },
  );
});

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

describe('CreateTransaction', () => {
  let database: Database;
  let createTransaction: CreateTransaction;
  let listShares: ListShares;
  let getMonthlyBalance: GetMonthlyBalance;
  let getTotalBalance: GetTotalBalance;

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
        if (
          description ===
          'Should charge tax when selling more than 20k on month'
        ) {
          console.log(1);
        }

        const transaction = await createTransaction.execute(transactionParams);

        const shares = await listShares.execute(transaction.getInstitutionId());

        const monthlyBalance = await getMonthlyBalance.execute(transaction);

        const totalBalance = await getTotalBalance.execute(
          transaction.getInstitutionId(),
        );

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
});

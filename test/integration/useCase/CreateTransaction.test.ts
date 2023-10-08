import 'reflect-metadata';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { createTransactionCases } from '@fixtures/cases';
import CreateTransaction from '@application/useCases/CreateTransaction';
import CalculateInstitutionBalance from '@application/useCases/CalculateInstitutionBalance';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import institution from '@fixtures/institution';
import ListShares from '@application/queries/ListShares';
import GetOrCreateMonthlyBalance from '@application/useCases/GetOrCreateMonthlyBalance';
import GetTotalBalance from '@application/queries/GetTotalBalance';

describe('CreateTransaction', () => {
  let database: Database;
  let createTransaction: CreateTransaction;
  let listShares: ListShares;
  let getOrCreateMonthlyBalance: GetOrCreateMonthlyBalance;
  let getTotalBalance: GetTotalBalance;
  let calculateInstitutionBalance: CalculateInstitutionBalance;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createTransaction = container.get<CreateTransaction>(
      TYPES.CreateTransaction,
    );
    listShares = container.get<ListShares>(TYPES.ListShares);
    getOrCreateMonthlyBalance = container.get<GetOrCreateMonthlyBalance>(
      TYPES.GetOrCreateMonthlyBalance,
    );
    getTotalBalance = container.get<GetTotalBalance>(TYPES.GetTotalBalance);
    calculateInstitutionBalance = container.get<CalculateInstitutionBalance>(
      TYPES.CalculateInstitutionBalance,
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
        const transaction = await createTransaction.execute(transactionParams);

        const shares = await listShares.execute(transaction.getInstitutionId());

        const monthlyBalance =
          await getOrCreateMonthlyBalance.execute(transaction);

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

  describe('after call use case ', () => {
    it('Should update the Profit with the sum of all earnings, less taxes and the remaining loss', async () => {
      const expectedBalance = { loss: 0, profit: 1721806.6940386684 };

      const profit = await calculateInstitutionBalance.execute(institution.id);

      expect(expectedBalance).toEqual(profit);
    });
  });
});

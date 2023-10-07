import 'reflect-metadata';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { createTransactionCases } from '@fixtures/cases';
import { dateToMonthYear, formatterMoney } from '@helpers';
import CreateTransaction from '@application/useCases/CreateTransaction';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';
import GetInstitutionBalance from '@application/useCases/GetInstitutionBalance';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';
import institution from '@fixtures/institution';

describe('CreateTransaction', () => {
  let database: Database;
  let createTransaction: CreateTransaction;
  let shareRepository: ShareRepository;
  let monthlyBalanceRepository: MonthlyBalanceRepository;
  let totalBalanceRepository: TotalBalanceRepository;
  let getInstitutionBalance: GetInstitutionBalance;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createTransaction = container.get<CreateTransaction>(
      TYPES.CreateTransaction,
    );
    shareRepository = container.get<ShareRepository>(TYPES.ShareRepository);
    monthlyBalanceRepository = container.get<MonthlyBalanceRepository>(
      TYPES.MonthlyBalanceRepository,
    );
    totalBalanceRepository = container.get<TotalBalanceRepository>(
      TYPES.TotalBalanceRepository,
    );
    getInstitutionBalance = container.get<GetInstitutionBalance>(
      TYPES.GetInstitutionBalance,
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
      transaction,
      expectedShare,
      expectedMonthlyBalance,
      expectedTotalBalance,
      description,
    ) => {
      it(description, async () => {
        await createTransaction.execute(transaction);

        const shares = await shareRepository.getAll(transaction.institutionId);

        const monthlyBalance = await monthlyBalanceRepository.get(
          transaction.institutionId,
          dateToMonthYear(transaction.date),
        );

        const totalBalance = await totalBalanceRepository.get(
          transaction.institutionId,
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

      const profit = await getInstitutionBalance.execute(institution.id);

      expect(expectedBalance).toEqual(profit);
    });
  });
});

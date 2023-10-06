import 'reflect-metadata';
import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { createTransactionCases } from '@fixtures/cases';
import {
  dateToMonthYear,
  formatterMoney,
} from '@helpers';
import CreateTransaction from '@application/useCases/CreateTransaction';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';
import GetProfit from '@application/useCases/GetProfit';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareFactory from '@factories/ShareFactory';

describe('CreateTransaction', () => {
  let database: Database;
  let createTransaction: CreateTransaction; 
  let shareRepository: ShareRepository; 
  let monthlyBalanceRepository: MonthlyBalanceRepository; 
  let totalBalanceRepository: TotalBalanceRepository; 
  let getProfit: GetProfit; 

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    createTransaction = container.get<CreateTransaction>(TYPES.CreateTransaction);
    shareRepository = container.get<ShareRepository>(TYPES.ShareRepository);
    monthlyBalanceRepository = container.get<MonthlyBalanceRepository>(TYPES.MonthlyBalanceRepository);
    totalBalanceRepository = container.get<TotalBalanceRepository>(TYPES.TotalBalanceRepository);
    getProfit = container.get<GetProfit>(TYPES.GetProfit);

    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    jest.clearAllMocks();
  });

  describe.each(createTransactionCases)(
    'when call use case',
    (
      transaction,
      expectedShare,
      expectedMonthlyBalance,
      expectedTotalBalance,
    ) => {
      it(`Should create the transaction and update the monthly and total balance for the ${transaction.ticketSymbol} share `, async () => {
        await createTransaction.execute(transaction);

        const shares = await shareRepository.getAll(transaction.institutionId)

        const monthlyBalance = await monthlyBalanceRepository.get(
          transaction.institutionId,
          dateToMonthYear(transaction.date),
        );

        const totalBalance = await totalBalanceRepository.get(transaction.institutionId);

        expect(expectedShare).toEqual(shares.map((share) => new ShareFactory({}, share).getObject()));
        expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, monthlyBalance).getObject());
        expect(expectedTotalBalance).toEqual(new TotalBalanceFactory({}, totalBalance).getObject());
      });
    },
  );

  describe('totalBalance ', () => {
    it('should get profit', async () => {
      const instituionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2';
      const profit = await getProfit.execute(instituionId);

      const expectedProfit = 1721806.6940386684;

      expect(formatterMoney(expectedProfit)).toBe(profit);
    });
  });
});

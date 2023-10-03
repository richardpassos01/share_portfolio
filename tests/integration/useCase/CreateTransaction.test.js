import {
  database,
  createTransaction,
  shareRepository,
  monthlyBalanceRepository,
  totalBalanceRepository,
  getProfit,
} from '../../../src/DependencyInjectionContainer';
import { createTransactionCases } from '../../fixtures/cases.js';
import {
  dateToMonthYear,
  formatterMoney,
} from '../../../src/helpers/Helpers.js';

describe('CreateTransaction', () => {
  beforeAll(async () => {
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
    ) => {
      it(`Should create the transaction and update the monthly and total balance for the ${transaction.ticketSymbol} share `, async () => {
        await createTransaction.execute(transaction);

        const shares = (
          await shareRepository.getAll(transaction.institutionId)
        ).map(({ id, institutionId, mediumPrice, ...share }) => share);

        const {
          id: __,
          institutionId: ___,
          ...monthlyBalance
        } = await monthlyBalanceRepository.get(
          transaction.institutionId,
          dateToMonthYear(transaction.date),
        );

        const {
          id: ____,
          institutionId: _____,
          ...totalBalance
        } = await totalBalanceRepository.get(transaction.institutionId);

        expect(expectedShare).toEqual(shares);
        expect(expectedMonthlyBalance).toEqual(monthlyBalance);
        expect(expectedTotalBalance).toEqual(totalBalance);
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

import {
  database,
  createTransaction,
  shareRepository,
  monthlyBalanceRepository,
  totalBalanceRepository,
} from '../../../src/DependencyInjectionContainer';
import { createTransactionCases } from '../../fixtures/cases.js';
import { dateToMonthYear } from '../../../src/helpers/Helpers.js';

describe('CreateTransaction', () => {
  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
  });

  afterAll(async () => {
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
      it(`Should create the transaction and update the monthly and total balances for the ${transaction.ticketSymbol} share `, async () => {
        await createTransaction.execute(transaction);

        const { id: _shareId, ...share } = await shareRepository.get(
          transaction.ticketSymbol,
          transaction.institutionId,
        );
        const { id: _monthlyId, ...monthlyBalance } =
          await monthlyBalanceRepository.get(
            transaction.getInstitutionId(),
            dateToMonthYear(transaction.date),
          );
        const { id: balanceId, ...totalBalance } =
          await totalBalanceRepository.get(transaction.institutionId);

        expect(expectedShare).toBe(share);
        expect(expectedMonthlyBalance).toBe(monthlyBalance);
        expect(expectedTotalBalance).toBe(totalBalance);
      });
    },
  );
});

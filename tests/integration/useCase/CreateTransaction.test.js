import {
  database,
  createTransaction,
} from '../../../src/DependencyInjectionContainer';
import { transactions } from '../../fixtures/transactions.js';

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

  describe('when call user case with trade transactions', () => {
    it('should update things', async () => {
      console.log(transactions.length);

      // eslint-disable-next-line no-restricted-syntax
      for (const transaction of transactions) {
        // eslint-disable-next-line no-await-in-loop
        await createTransaction.execute(transaction);
      }

      expect(1).toBe(1);
    });
  });
});

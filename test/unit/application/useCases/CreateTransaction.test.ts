import { TYPES } from '@constants/types';
import CreateTransactions from '@application/useCases/CreateTransactions';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import container from '@dependencyInjectionContainer';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import { transactions } from '@fixtures/transactions';
import TransactionFactory from '@factories/TransactionFactory';

describe('CreateTransactions', () => {
  let createTransactions: CreateTransactions;
  let transactionRepository: TransactionRepositoryInterface;
  let updatePortfolio: UpdatePortfolio;

  beforeAll(async () => {
    createTransactions = container.get<CreateTransactions>(
      TYPES.CreateTransactions,
    );
    transactionRepository = container.get<TransactionRepositoryInterface>(
      TYPES.TransactionRepository,
    );
    updatePortfolio = container.get<UpdatePortfolio>(TYPES.UpdatePortfolio);

    jest.spyOn(transactionRepository, 'createMany').mockImplementation();
  });

  it('should call the transaction repository with transactions in the correct order', async () => {
    jest.spyOn(updatePortfolio, 'execute').mockImplementation();
    const expectedTransactions = transactions.map((transaction) =>
      new TransactionFactory(transaction).get(),
    );

    const copyTransactions = [...transactions];
    copyTransactions.sort(() => Math.random() - 0.5);

    await createTransactions.execute(copyTransactions);

    expect(transactionRepository.createMany).toHaveBeenCalledWith(
      expect.arrayContaining(
        expectedTransactions.map((transaction) => {
          const { id: _, ...rest } = transaction;
          return expect.objectContaining(rest);
        }),
      ),
    );
  });
});

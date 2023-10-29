import { TYPES } from '@constants/types';
import CreateTransactions from '@application/useCases/CreateTransactions';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import container from '@dependencyInjectionContainer';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import { transactionsParams, listTransactions } from '@fixtures/transactions';
import institution from '@fixtures/institution';

jest.mock('uuid', () => ({
  v4: () => '123456',
}));

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

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should call the transaction repository with transactions in the correct order', async () => {
    jest.spyOn(updatePortfolio, 'execute').mockImplementation();

    const expectedTransactions = listTransactions();

    transactionsParams.sort(() => Math.random() - 0.5);

    await createTransactions.execute(institution.id, transactionsParams);

    expect(transactionRepository.createMany).toHaveBeenCalledWith(
      expectedTransactions,
    );
  });
});

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import TransactionFactory from '@factories/TransactionFactory';
import { ReasonPhrases } from '@domain/shared/enums';
import ProcessSellTransaction from '@application/useCases/ProcessSellTransaction';
import GetShare from '@application/queries/GetShare';
import NotFoundError from '@domain/shared/error/NotFoundError';
import BalanceManagement from '@domain/portfolio/BalanceManagement';

describe('ProcessSellTransaction', () => {
  let processSellTransaction: ProcessSellTransaction;
  let getShare: GetShare;
  let balanceManagement: BalanceManagement;

  beforeAll(async () => {
    processSellTransaction = container.get<ProcessSellTransaction>(
      TYPES.ProcessSellTransaction,
    );
    getShare = container.get<GetShare>(TYPES.GetShare);
    balanceManagement = new BalanceManagement();
  });

  beforeEach(() => {
    jest
      .spyOn(getShare, 'execute')
      .mockImplementation(() => Promise.resolve(undefined));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should throw share not found error when share does not exists', async () => {
    const transaction = new TransactionFactory().get();

    processSellTransaction
      .execute(transaction, balanceManagement)
      .catch((error) => {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe(ReasonPhrases.SHARE_NOT_FOUND);
      });
  });
});

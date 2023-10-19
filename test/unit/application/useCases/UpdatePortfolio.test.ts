import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import ProcessDividendTransaction from '@application/useCases/ProcessDividendTransaction';
import TransactionFactory from '@factories/TransactionFactory';
import { TRANSACTION_CATEGORY } from '@domain/shared/enums';
import UpdateBalances from '@application/useCases/UpdateBalances';
import CreateBalanceManagement from '@application/useCases/CreateBalanceManagement';
import BalanceManagement from '@domain/portfolio/BalanceManagement';
import ProcessSpecialEventsOnShare from '@application/useCases/ProcessSpecialEventsOnShare';
import ProcessTradeTransaction from '@application/useCases/ProcessTradeTransaction';

jest.mock('uuid', () => ({
  v4: () => '123456',
}));

describe('UpdatePortfolio', () => {
  let updatePortfolio: UpdatePortfolio;
  let processDividendTransaction: ProcessDividendTransaction;
  let updateBalances: UpdateBalances;
  let createBalanceManagement: CreateBalanceManagement;
  let balanceManagement: BalanceManagement;
  let processSpecialEventsOnShare: ProcessSpecialEventsOnShare;
  let processTradeTransaction: ProcessTradeTransaction;

  beforeAll(async () => {
    updatePortfolio = container.get<UpdatePortfolio>(TYPES.UpdatePortfolio);
    updateBalances = container.get<UpdateBalances>(TYPES.UpdateBalances);
    processDividendTransaction = container.get<ProcessDividendTransaction>(
      TYPES.ProcessDividendTransaction,
    );
    processSpecialEventsOnShare = container.get<ProcessSpecialEventsOnShare>(
      TYPES.ProcessSpecialEventsOnShare,
    );
    processTradeTransaction = container.get<ProcessTradeTransaction>(
      TYPES.ProcessTradeTransaction,
    );
    createBalanceManagement = container.get<CreateBalanceManagement>(
      TYPES.CreateBalanceManagement,
    );
    balanceManagement = new BalanceManagement();
  });

  beforeEach(() => {
    jest.spyOn(updateBalances, 'execute').mockImplementation();
    jest.spyOn(processDividendTransaction, 'execute').mockImplementation();
    jest.spyOn(processSpecialEventsOnShare, 'execute').mockImplementation();
    jest.spyOn(processTradeTransaction, 'execute').mockImplementation();

    jest
      .spyOn(createBalanceManagement, 'execute')
      .mockImplementation(() => Promise.resolve(balanceManagement));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should call updateBalances', async () => {
    const transaction = new TransactionFactory().get();

    await updatePortfolio.execute(transaction);

    expect(updateBalances.execute).toHaveBeenCalledWith(
      balanceManagement,
      transaction,
    );
  });

  it('should call processDividendTransaction for DIVIDEND transaction.', async () => {
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.DIVIDENDS,
    }).get();

    await updatePortfolio.execute(transaction);

    expect(processDividendTransaction.execute).toBeCalledTimes(1);
  });

  it('Should call processSpecialEventsOnShare for SPLIT transaction.', async () => {
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.SPLIT,
    }).get();

    await updatePortfolio.execute(transaction);

    expect(processSpecialEventsOnShare.execute).toBeCalledTimes(1);
  });

  it('Should call processSpecialEventsOnShare for BONUS_SHARE transaction.', async () => {
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.BONUS_SHARE,
    }).get();

    await updatePortfolio.execute(transaction);

    expect(processSpecialEventsOnShare.execute).toBeCalledTimes(1);
  });

  it('Should call processTradeTransaction for TRADE transaction.', async () => {
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.TRADE,
    }).get();

    await updatePortfolio.execute(transaction);

    expect(processTradeTransaction.execute).toBeCalledTimes(1);
  });
});

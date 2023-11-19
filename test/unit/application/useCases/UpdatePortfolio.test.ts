import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import TransactionFactory from '@factories/TransactionFactory';
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import UpdateBalances from '@application/useCases/UpdateBalances';
import BalanceManagement from '@domain/balance/BalanceManagement';
import BalanceManagementFactory from '@domain/balance/BalanceManagementFactory';
import UpdateShare from '@application/useCases/UpdateShare';
import GetShare from '@application/queries/GetShare';
import Share from '@domain/share/Share';
import ShareFactory from '@factories/ShareFactory';
import { MONTHLY_BALANCE_TYPE } from '@domain/balance/monthlyBalance/MonthlyBalanceEnums';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';

jest.mock('uuid', () => ({
  v4: () => '123456',
}));

describe('UpdatePortfolio', () => {
  let updatePortfolio: UpdatePortfolio;
  let updateShare: UpdateShare;
  let updateBalances: UpdateBalances;
  let getShare: GetShare;
  let balanceManagementFactory: BalanceManagementFactory;
  let balanceManagement: BalanceManagement;
  let transactionRepository: TransactionRepositoryInterface;
  let share: Share;

  beforeAll(async () => {
    updatePortfolio = container.get<UpdatePortfolio>(TYPES.UpdatePortfolio);
    updateBalances = container.get<UpdateBalances>(TYPES.UpdateBalances);
    updateShare = container.get<UpdateShare>(TYPES.UpdateShare);
    getShare = container.get<GetShare>(TYPES.GetShare);
    transactionRepository = container.get<TransactionRepositoryInterface>(
      TYPES.TransactionRepository,
    );
    share = new ShareFactory().get();
    balanceManagementFactory = container.get<BalanceManagementFactory>(
      TYPES.BalanceManagementFactory,
    );
  });

  beforeEach(() => {
    balanceManagement = new BalanceManagement();
    jest.spyOn(updateBalances, 'execute').mockImplementation();
    jest.spyOn(updateShare, 'execute').mockImplementation();
    jest
      .spyOn(getShare, 'execute')
      .mockImplementation(() => Promise.resolve(share));
    jest
      .spyOn(balanceManagementFactory, 'build')
      .mockImplementation(() => Promise.resolve(balanceManagement));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should call updateBalances with valid values for BUY transaction', async () => {
    const expectedMonthlyBalanceManagement = new BalanceManagement();
    const transaction = new TransactionFactory().get();

    await updatePortfolio.execute(transaction);

    expect(updateBalances.execute).toHaveBeenCalledWith(
      expectedMonthlyBalanceManagement,
      transaction,
    );
  });

  it('should call updateBalances with valid values for DIVIDEND transaction.', async () => {
    const expectedMonthlyBalanceManagement = new BalanceManagement();
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.DIVIDENDS,
    }).get();

    expectedMonthlyBalanceManagement.setDividendEarning(transaction.totalCost);

    await updatePortfolio.execute(transaction);

    expect(updateBalances.execute).toHaveBeenCalledWith(
      expectedMonthlyBalanceManagement,
      transaction,
    );
  });

  it('Should call updateBalances with valid values for SPLIT transaction.', async () => {
    const expectedMonthlyBalanceManagement = new BalanceManagement();
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.SPLIT,
    }).get();

    await updatePortfolio.execute(transaction);

    expect(updateBalances.execute).toHaveBeenCalledWith(
      expectedMonthlyBalanceManagement,
      transaction,
    );
  });

  it('Should call updateBalances with valid values for BONUS_SHARE transaction.', async () => {
    const expectedMonthlyBalanceManagement = new BalanceManagement();
    const transaction = new TransactionFactory({
      category: TRANSACTION_CATEGORY.BONUS_SHARE,
    }).get();

    await updatePortfolio.execute(transaction);

    expect(updateBalances.execute).toHaveBeenCalledWith(
      expectedMonthlyBalanceManagement,
      transaction,
    );
  });

  it('Should call updateBalances with valid values for SELL transaction.', async () => {
    const expectedMonthlyBalanceManagement = new BalanceManagement();
    const buyTransaction = new TransactionFactory().get();
    const sellTransaction = new TransactionFactory({
      type: TRANSACTION_TYPE.SELL,
      unitPrice: 20,
      totalCost: 2000,
    }).get();

    jest
      .spyOn(transactionRepository, 'listTradesFromSameMonth')
      .mockImplementation(() =>
        Promise.resolve([buyTransaction, sellTransaction]),
      );

    await updatePortfolio.execute(sellTransaction);

    expectedMonthlyBalanceManagement.setMonthlyOperationType(
      MONTHLY_BALANCE_TYPE.DAY_TRADE,
    );
    expectedMonthlyBalanceManagement.setTax(180);
    expectedMonthlyBalanceManagement.setTaxWithholding(2000);
    expectedMonthlyBalanceManagement.setTradeEarning(1000);

    expect(updateBalances.execute).toHaveBeenCalledWith(
      expectedMonthlyBalanceManagement,
      sellTransaction,
    );
  });
});

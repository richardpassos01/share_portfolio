import { Container } from 'inversify';
import { TYPES } from '@constants/types';

import Database from '@infrastructure/database/Database';

import InstitutionController from '@api/institution/InstitutionController';
import TransactionController from '@api/transaction/TransactionController';
import PortfolioController from '@api/portfolio/PortfolioController';

import GetInstitution from '@application/queries/GetInstitution';
import ListShares from '@application/queries/ListShares';
import GetShare from '@application/queries/GetShare';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import ListTransactions from '@application/queries/ListTransactions';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import ListMonthlyBalance from '@application/queries/ListMonthlyBalance';

import CreateInstitution from '@application/useCases/CreateInstitution';
import CreateShare from '@application/useCases/CreateShare';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import CreateTransactions from '@application/useCases/CreateTransactions';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import CreateOrUpdateMonthlyBalance from '@application/useCases/CreateOrUpdateMonthlyBalance';
import CreateOrUpdateTotalBalance from '@application/useCases/CreateOrUpdateTotalBalance';
import ProcessDividendTransaction from '@application/useCases/ProcessDividendTransaction';
import ProcessSpecialEventsOnShare from '@application/useCases/ProcessSpecialEventsOnShare';
import ProcessTradeTransaction from '@application/useCases/ProcessTradeTransaction';
import ProcessBuyTransaction from '@application/useCases/ProcessBuyTransaction';
import ProcessSellTransaction from '@application/useCases/ProcessSellTransaction';
import ListTradeTransactionsFromMonth from '@application/useCases/ListTradeTransactionsFromMonth';
import CreateBalanceManagement from '@application/useCases/CreateBalanceManagement';
import UpdateBalances from '@application/useCases/UpdateBalances';
import ReSyncPortfolio from '@application/useCases/ReSyncPortfolio';
import CreatePortfolio from '@application/useCases/CreatePortfolio';
import UpdateOrLiquidateShare from '@application/useCases/UpdateOrLiquidateShare';

import InstitutionRepository from '@infrastructure/repositories/InstitutionRepository';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';

import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import TotalBalanceRepositoryInterface from '@domain/portfolio/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/portfolio/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

const container = new Container({
  skipBaseClassChecks: true,
});

container.bind<Database>(TYPES.Database).to(Database).inSingletonScope();

container
  .bind<InstitutionController>(TYPES.InstitutionController)
  .to(InstitutionController)
  .inSingletonScope();
container
  .bind<TransactionController>(TYPES.TransactionController)
  .to(TransactionController)
  .inSingletonScope();
container
  .bind<PortfolioController>(TYPES.PortfolioController)
  .to(PortfolioController)
  .inSingletonScope();

container
  .bind<GetInstitution>(TYPES.GetInstitution)
  .to(GetInstitution)
  .inSingletonScope();
container.bind<GetShare>(TYPES.GetShare).to(GetShare).inSingletonScope();
container.bind<ListShares>(TYPES.ListShares).to(ListShares).inSingletonScope();
container
  .bind<GetTotalBalance>(TYPES.GetTotalBalance)
  .to(GetTotalBalance)
  .inSingletonScope();
container
  .bind<GetMonthlyBalance>(TYPES.GetMonthlyBalance)
  .to(GetMonthlyBalance)
  .inSingletonScope();
container
  .bind<ListMonthlyBalance>(TYPES.ListMonthlyBalance)
  .to(ListMonthlyBalance)
  .inSingletonScope();
container
  .bind<ListTransactions>(TYPES.ListTransactions)
  .to(ListTransactions)
  .inSingletonScope();

container
  .bind<CreateInstitution>(TYPES.CreateInstitution)
  .to(CreateInstitution)
  .inSingletonScope();
container
  .bind<CreateShare>(TYPES.CreateShare)
  .to(CreateShare)
  .inSingletonScope();
container
  .bind<UpdateOrLiquidateShare>(TYPES.UpdateOrLiquidateShare)
  .to(UpdateOrLiquidateShare)
  .inSingletonScope();
container
  .bind<UpdatePortfolio>(TYPES.UpdatePortfolio)
  .to(UpdatePortfolio)
  .inSingletonScope();
container
  .bind<ReSyncPortfolio>(TYPES.ReSyncPortfolio)
  .to(ReSyncPortfolio)
  .inSingletonScope();
container
  .bind<CreateTransactions>(TYPES.CreateTransactions)
  .to(CreateTransactions)
  .inSingletonScope();
container
  .bind<DeleteTransactions>(TYPES.DeleteTransactions)
  .to(DeleteTransactions)
  .inSingletonScope();
container
  .bind<CreateOrUpdateMonthlyBalance>(TYPES.CreateOrUpdateMonthlyBalance)
  .to(CreateOrUpdateMonthlyBalance)
  .inSingletonScope();
container
  .bind<CreateOrUpdateTotalBalance>(TYPES.CreateOrUpdateTotalBalance)
  .to(CreateOrUpdateTotalBalance)
  .inSingletonScope();
container
  .bind<ProcessDividendTransaction>(TYPES.ProcessDividendTransaction)
  .to(ProcessDividendTransaction)
  .inSingletonScope();
container
  .bind<ProcessSpecialEventsOnShare>(TYPES.ProcessSpecialEventsOnShare)
  .to(ProcessSpecialEventsOnShare)
  .inSingletonScope();
container
  .bind<ProcessTradeTransaction>(TYPES.ProcessTradeTransaction)
  .to(ProcessTradeTransaction)
  .inSingletonScope();
container
  .bind<ProcessBuyTransaction>(TYPES.ProcessBuyTransaction)
  .to(ProcessBuyTransaction)
  .inSingletonScope();
container
  .bind<ProcessSellTransaction>(TYPES.ProcessSellTransaction)
  .to(ProcessSellTransaction)
  .inSingletonScope();
container
  .bind<ListTradeTransactionsFromMonth>(TYPES.ListTradeTransactionsFromMonth)
  .to(ListTradeTransactionsFromMonth)
  .inSingletonScope();
container
  .bind<CreateBalanceManagement>(TYPES.CreateBalanceManagement)
  .to(CreateBalanceManagement)
  .inSingletonScope();
container
  .bind<UpdateBalances>(TYPES.UpdateBalances)
  .to(UpdateBalances)
  .inSingletonScope();
container
  .bind<CreatePortfolio>(TYPES.CreatePortfolio)
  .to(CreatePortfolio)
  .inSingletonScope();

container
  .bind<InstitutionRepositoryInterface>(TYPES.InstitutionRepository)
  .to(InstitutionRepository)
  .inSingletonScope();
container
  .bind<ShareRepositoryInterface>(TYPES.ShareRepository)
  .to(ShareRepository)
  .inSingletonScope();
container
  .bind<TransactionRepositoryInterface>(TYPES.TransactionRepository)
  .to(TransactionRepository)
  .inSingletonScope();
container
  .bind<MonthlyBalanceRepositoryInterface>(TYPES.MonthlyBalanceRepository)
  .to(MonthlyBalanceRepository)
  .inSingletonScope();
container
  .bind<TotalBalanceRepositoryInterface>(TYPES.TotalBalanceRepository)
  .to(TotalBalanceRepository)
  .inSingletonScope();

export default container;

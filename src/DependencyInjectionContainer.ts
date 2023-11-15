import { Container } from 'inversify';
import { TYPES } from '@constants/types';

import Database from '@infrastructure/database/Database';

import InstitutionController from '@api/institution/InstitutionController';
import TransactionController from '@api/transaction/TransactionController';
import MonthlyBalanceController from '@api/balance/monthlyBalance/MonthlyBalanceController';
import TotalBalanceController from '@api/balance/totalBalance/TotalBalanceController';
import ResyncController from '@api/resync/ResyncController';

import ListInstitutions from '@application/queries/ListInstitutions';
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
import ListTradeTransactionsFromMonth from '@application/useCases/ListTradeTransactionsFromMonth';
import UpdateBalances from '@application/useCases/UpdateBalances';
import ResyncPortfolio from '@application/useCases/ResyncPortfolio';
import UpdateShare from '@application/useCases/UpdateShare';

import InstitutionRepository from '@infrastructure/repositories/InstitutionRepository';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';

import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import TotalBalanceRepositoryInterface from '@domain/balance/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/balance/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

import BalanceManagementFactory from '@domain/balance/BalanceManagementFactory';

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
  .bind<ResyncController>(TYPES.ResyncController)
  .to(ResyncController)
  .inSingletonScope();
container
  .bind<MonthlyBalanceController>(TYPES.MonthlyBalanceController)
  .to(MonthlyBalanceController)
  .inSingletonScope();
container
  .bind<TotalBalanceController>(TYPES.TotalBalanceController)
  .to(TotalBalanceController)
  .inSingletonScope();

container
  .bind<ListInstitutions>(TYPES.ListInstitutions)
  .to(ListInstitutions)
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
  .bind<UpdateShare>(TYPES.UpdateShare)
  .to(UpdateShare)
  .inSingletonScope();
container
  .bind<UpdatePortfolio>(TYPES.UpdatePortfolio)
  .to(UpdatePortfolio)
  .inSingletonScope();
container
  .bind<ResyncPortfolio>(TYPES.ResyncPortfolio)
  .to(ResyncPortfolio)
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
  .bind<ListTradeTransactionsFromMonth>(TYPES.ListTradeTransactionsFromMonth)
  .to(ListTradeTransactionsFromMonth)
  .inSingletonScope();
container
  .bind<UpdateBalances>(TYPES.UpdateBalances)
  .to(UpdateBalances)
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

container
  .bind<BalanceManagementFactory>(TYPES.BalanceManagementFactory)
  .to(BalanceManagementFactory)
  .inSingletonScope();

export default container;

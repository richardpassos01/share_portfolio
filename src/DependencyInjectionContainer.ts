import { Container } from 'inversify';
import { TYPES } from '@constants/types';

import Database from '@infrastructure/database/Database';

import InstitutionController from '@api/institution/InstitutionController';
import TransactionController from '@api/transaction/TransactionController';

import GetInstitution from '@application/queries/GetInstitution';
import ListShares from '@application/queries/ListShares';
import GetShare from '@application/queries/GetShare';
import GetTotalBalance from '@application/queries/GetTotalBalance';
import ListTransactions from '@application/queries/ListTransactions';

import GetInstitutionBalance from '@application/useCases/GetInstitutionBalance';
import CreateInstitution from '@application/useCases/CreateInstitution';
import CreateShare from '@application/useCases/CreateShare';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import CreateTransaction from '@application/useCases/CreateTransaction';
import GetOrCreateMonthlyBalance from '@application/useCases/GetOrCreateMonthlyBalance';
import UpdateMonthlyBalance from '@application/useCases/UpdateMonthlyBalance';
import CreateTotalBalance from '@application/useCases/CreateTotalBalance';
import UpdateTotalBalance from '@application/useCases/UpdateTotalBalance';
import ProcessDividendTransaction from '@application/useCases/ProcessDividendTransaction';

import InstitutionRepository from '@infrastructure/repositories/InstitutionRepository';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';

import UpdateShare from '@application/useCases/UpdateShare';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import ProcessSpecialEventsOnShare from '@application/useCases/ProcessSpecialEventsOnShare';
import ProcessBuyTransaction from '@application/useCases/ProcessBuyTransaction';
import ProcessSellTransaction from '@application/useCases/ProcessSellTransaction';
import ListTradeTransactionsFromMonth from '@application/useCases/ListTradeTransactionsFromMonth';
import ProcessTradeTransaction from '@application/useCases/ProcessTradeTransaction';

import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import TotalBalanceRepositoryInterface from '@domain/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';

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
  .bind<GetInstitution>(TYPES.GetInstitution)
  .to(GetInstitution)
  .inSingletonScope();
container
  .bind<CreateInstitution>(TYPES.CreateInstitution)
  .to(CreateInstitution)
  .inSingletonScope();
container.bind<GetShare>(TYPES.GetShare).to(GetShare).inSingletonScope();
container.bind<ListShares>(TYPES.ListShares).to(ListShares).inSingletonScope();
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
  .bind<CreateTransaction>(TYPES.CreateTransaction)
  .to(CreateTransaction)
  .inSingletonScope();
container
  .bind<DeleteTransactions>(TYPES.DeleteTransactions)
  .to(DeleteTransactions)
  .inSingletonScope();
container
  .bind<ListTransactions>(TYPES.ListTransactions)
  .to(ListTransactions)
  .inSingletonScope();
container
  .bind<GetOrCreateMonthlyBalance>(TYPES.GetOrCreateMonthlyBalance)
  .to(GetOrCreateMonthlyBalance)
  .inSingletonScope();
container
  .bind<UpdateMonthlyBalance>(TYPES.UpdateMonthlyBalance)
  .to(UpdateMonthlyBalance)
  .inSingletonScope();
container
  .bind<GetTotalBalance>(TYPES.GetTotalBalance)
  .to(GetTotalBalance)
  .inSingletonScope();
container
  .bind<CreateTotalBalance>(TYPES.CreateTotalBalance)
  .to(CreateTotalBalance)
  .inSingletonScope();
container
  .bind<UpdateTotalBalance>(TYPES.UpdateTotalBalance)
  .to(UpdateTotalBalance)
  .inSingletonScope();
container
  .bind<GetInstitutionBalance>(TYPES.GetInstitutionBalance)
  .to(GetInstitutionBalance)
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

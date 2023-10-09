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

import CreateInstitution from '@application/useCases/CreateInstitution';
import CreateShare from '@application/useCases/CreateShare';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import CreateTransactions from '@application/useCases/CreateTransactions';
import CreateOrUpdateMonthlyBalance from '@application/useCases/CreateOrUpdateMonthlyBalance';
import CreateOrUpdateTotalBalance from '@application/useCases/CreateOrUpdateTotalBalance';
import ProcessDividendTransaction from '@application/useCases/ProcessDividendTransaction';
import CreateFinancialReportFromBalances from '@application/useCases/CreateFinancialReportFromBalances';
import UpdateBalancesFromFinancialReport from '@application/useCases/UpdateBalancesFromFinancialReport';

import InstitutionRepository from '@infrastructure/repositories/InstitutionRepository';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';

import UpdateOrLiquidateShare from '@application/useCases/UpdateOrLiquidateShare';
import DeleteTransactions from '@application/useCases/DeleteTransactions';
import ProcessSpecialEventsOnShare from '@application/useCases/ProcessSpecialEventsOnShare';
import ProcessBuyTransaction from '@application/useCases/ProcessBuyTransaction';
import ProcessSellTransaction from '@application/useCases/ProcessSellTransaction';
import ListTradeTransactionsFromMonth from '@application/useCases/ListTradeTransactionsFromMonth';
import ProcessTradeTransaction from '@application/useCases/ProcessTradeTransaction';

import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import TotalBalanceRepositoryInterface from '@domain/financialReport/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/financialReport/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import GetMonthlyBalance from '@application/queries/GetMonthlyBalance';
import FinancialReportController from '@api/financialReport/FinancialReportController';
import CalculateTotalBalanceEarning from '@application/useCases/CalculateTotalBalanceEarning';

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
  .bind<FinancialReportController>(TYPES.FinancialReportController)
  .to(FinancialReportController)
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
  .bind<UpdateOrLiquidateShare>(TYPES.UpdateOrLiquidateShare)
  .to(UpdateOrLiquidateShare)
  .inSingletonScope();
container
  .bind<UpdatePortfolio>(TYPES.UpdatePortfolio)
  .to(UpdatePortfolio)
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
  .bind<ListTransactions>(TYPES.ListTransactions)
  .to(ListTransactions)
  .inSingletonScope();
container
  .bind<CreateOrUpdateMonthlyBalance>(TYPES.CreateOrUpdateMonthlyBalance)
  .to(CreateOrUpdateMonthlyBalance)
  .inSingletonScope();
container
  .bind<GetTotalBalance>(TYPES.GetTotalBalance)
  .to(GetTotalBalance)
  .inSingletonScope();
container
  .bind<GetMonthlyBalance>(TYPES.GetMonthlyBalance)
  .to(GetMonthlyBalance)
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
  .bind<CreateFinancialReportFromBalances>(
    TYPES.CreateFinancialReportFromBalances,
  )
  .to(CreateFinancialReportFromBalances)
  .inSingletonScope();
container
  .bind<UpdateBalancesFromFinancialReport>(
    TYPES.UpdateBalancesFromFinancialReport,
  )
  .to(UpdateBalancesFromFinancialReport)
  .inSingletonScope();
container
  .bind<CalculateTotalBalanceEarning>(TYPES.CalculateTotalBalanceEarning)
  .to(CalculateTotalBalanceEarning)
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

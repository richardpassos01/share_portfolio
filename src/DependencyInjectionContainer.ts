import { Container } from 'inversify';
import { TYPES } from '@constants/types';

import Database from '@infrastructure/database/Database';

import InstitutionController from '@api/institution/InstitutionController';
import TransactionController from '@api/transaction/TransactionController';

import GetInstitution from '@application/useCases/GetInstitution';
import CreateInstitution from '@application/useCases/CreateInstitution';
import GetShare from '@application/useCases/GetShare';
import CreateShare from '@application/useCases/CreateShare';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import CreateTransaction from '@application/useCases/CreateTransaction';
import GetMonthlyBalance from '@application/useCases/GetMonthlyBalance';
import CreateMonthlyBalance from '@application/useCases/CreateMonthlyBalance';
import UpdateMonthlyBalance from '@application/useCases/UpdateMonthlyBalance';
import GetTotalBalance from '@application/useCases/GetTotalBalance';
import CreateTotalBalance from '@application/useCases/CreateTotalBalance';
import UpdateTotalBalance from '@application/useCases/UpdateTotalBalance';
import GetInstitutionBalance from '@application/useCases/GetInstitutionBalance';

import InstitutionRepository from '@infrastructure/repositories/InstitutionRepository';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';

import InstitutionRepositoryInterface from '@domain/institution/interfaces/InstitutionRepositoryInterface';
import ShareRepositoryInterface from '@domain/share/interfaces/ShareRepositoryInterface';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import TotalBalanceRepositoryInterface from '@domain/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import UpdateShare from '@application/useCases/UpdateShare';

const container = new Container();

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
  .bind<GetMonthlyBalance>(TYPES.GetMonthlyBalance)
  .to(GetMonthlyBalance)
  .inSingletonScope();
container
  .bind<CreateMonthlyBalance>(TYPES.CreateMonthlyBalance)
  .to(CreateMonthlyBalance)
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

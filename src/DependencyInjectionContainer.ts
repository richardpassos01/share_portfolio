import {Container} from 'inversify';

import Database from '@infrastructure/database/Database';

import InstitutionController from '@api/institution/InstitutionController';
import TransactionController from '@api/transaction/TransactionController';

import GetInstitution from '@application/useCases/GetInstitution';
import GetShare from '@application/useCases/GetShare';
import CreateShare from '@application/useCases/CreateShare';
import UpdateShare from '@application/useCases/UpdateShare';
import UpdatePortfolio from '@application/useCases/UpdatePortfolio';
import CreateTransaction from '@application/useCases/CreateTransaction';
import GetMonthlyBalance from '@application/useCases/GetMonthlyBalance';
import CreateMonthlyBalance from '@application/useCases/CreateMonthlyBalance';
import UpdateMonthlyBalance from '@application/useCases/UpdateMonthlyBalance';
import GetTotalBalance from '@application/useCases/GetTotalBalance';
import CreateTotalBalance from '@application/useCases/CreateTotalBalance';
import UpdateTotalBalance from '@application/useCases/UpdateTotalBalance';
import GetProfit from '@application/useCases/GetProfit';

import InstitutionRepository from '@infrastructure/repositories/InstitutionRepository';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';

import {TYPES} from '@constants/types';

const container = new Container();

container.bind<Database>(TYPES.Database).to(Database).inSingletonScope();


export const institutionRepository = new InstitutionRepository(database);
export const shareRepository = new ShareRepository(database);
export const transactionRepository = new TransactionRepository(database);
export const monthlyBalanceRepository = new MonthlyBalanceRepository(database);
export const totalBalanceRepository = new TotalBalanceRepository(database);

export const getInstitution = new GetInstitution(institutionRepository);
export const createShare = new CreateShare(shareRepository);
export const getShare = new GetShare(shareRepository);
export const updateShare = new UpdateShare(shareRepository);
export const getMonthlyBalance = new GetMonthlyBalance(
  monthlyBalanceRepository,
);
export const createMonthlyBalance = new CreateMonthlyBalance(
  monthlyBalanceRepository,
);
export const updateMonthlyBalance = new UpdateMonthlyBalance(
  monthlyBalanceRepository,
);

export const getTotalBalance = new GetTotalBalance(totalBalanceRepository);
export const createTotalBalance = new CreateTotalBalance(
  totalBalanceRepository,
);
export const updateTotalBalance = new UpdateTotalBalance(
  totalBalanceRepository,
);
export const updatePortfolio = new UpdatePortfolio(
  shareRepository,
  transactionRepository,
  getShare,
  createShare,
  updateShare,
  getMonthlyBalance,
  createMonthlyBalance,
  updateMonthlyBalance,
  getTotalBalance,
  updateTotalBalance,
);
export const getProfit = new GetProfit(
  monthlyBalanceRepository,
  totalBalanceRepository,
);
export const createTransaction = new CreateTransaction(
  transactionRepository,
  updatePortfolio,
);

export const institutionController = new InstitutionController(
  getInstitution,
  getProfit,
);
export const transactionController = new TransactionController(
  createTransaction,
);


export default container;
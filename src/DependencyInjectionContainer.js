import Database from './infrastructure/database/Database.js';
import InstitutionController from './api/institution/InstitutionController.js';

import GetInstitution from './application/useCases/GetInstitution.js';
import GetShare from './application/useCases/GetShare.js';
import CreateShare from './application/useCases/CreateShare.js';
import UpdateShare from './application/useCases/UpdateShare.js';
import UpdatePortfolio from './application/useCases/UpdatePortfolio.js';
import CreateTransaction from './application/useCases/CreateTransaction.js';
import GetMonthlyBalance from './application/useCases/GetMonthlyBalance.js';
import CreateMonthlyBalance from './application/useCases/CreateMonthlyBalance.js';
import UpdateMonthlyBalance from './application/useCases/UpdateMonthlyBalance.js';
import GetTotalBalance from './application/useCases/GetTotalBalance.js';
import CreateTotalBalance from './application/useCases/CreateTotalBalance.js';
import UpdateTotalBalance from './application/useCases/UpdateTotalBalance.js';

import InstitutionRepository from './infrastructure/repositories/InstitutionRepository.js';
import ShareRepository from './infrastructure/repositories/ShareRepository.js';
import TransactionRepository from './infrastructure/repositories/TransactionRepository.js';
import MonthlyBalanceRepository from './infrastructure/repositories/MonthlyBalanceRepository.js';
import TotalBalanceRepository from './infrastructure/repositories/TotalBalanceRepository.js';

export const database = Database.getInstance();

export const institutionRepository = new InstitutionRepository(database);
export const shareRepository = new ShareRepository(database);
export const transactionRepository = new TransactionRepository(database);
export const monthlyBalanceRepository = new MonthlyBalanceRepository(database);
export const totalBalanceRepository = new TotalBalanceRepository(database);

export const createTransaction = new CreateTransaction(transactionRepository);
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
  getShare,
  createShare,
  updateShare,
  getMonthlyBalance,
  createMonthlyBalance,
  updateMonthlyBalance,
  getTotalBalance,
  updateTotalBalance,
);

export const institutionController = new InstitutionController(getInstitution);

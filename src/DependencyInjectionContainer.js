import Database from './infrastructure/database/Database.js';
import InstitutionController from './api/institution/InstitutionController.js';

import GetInstitution from './application/useCases/GetInstitution.js';
import CreateShare from './application/useCases/CreateShare.js';
import UpdateShare from './application/useCases/UpdateShare.js';
import UpdatePortfolio from './application/useCases/UpdatePortfolio.js';
import CreateMonthlyBalance from './application/useCases/CreateMonthlyBalance.js';
import CreateTransaction from './application/useCases/CreateTransaction.js';
import GetMonthlyBalance from './application/useCases/GetMonthlyBalance.js';
import UpdateMonthlyBalance from './application/useCases/UpdateMonthlyBalance.js';

import InstitutionRepository from './infrastructure/repositories/InstitutionRepository.js';
import ShareRepository from './infrastructure/repositories/ShareRepository.js';
import TransactionRepository from './infrastructure/repositories/TransactionRepository.js';
import MonthlyBalanceRepository from './infrastructure/repositories/MonthlyBalanceRepository.js';

export const database = Database.getInstance();

export const institutionRepository = new InstitutionRepository(database);
export const shareRepository = new ShareRepository(database);
export const transactionRepository = new TransactionRepository(database);
export const monthlyBalanceRepository = new MonthlyBalanceRepository(database);

export const getInstitution = new GetInstitution(institutionRepository);
export const createShare = new CreateShare(shareRepository);
export const updateShare = new UpdateShare(shareRepository);
export const createMonthlyBalance = new CreateMonthlyBalance(
  monthlyBalanceRepository,
);
export const getMonthlyBalance = new GetMonthlyBalance(
  monthlyBalanceRepository,
);
export const updateMonthlyBalance = new UpdateMonthlyBalance(
  monthlyBalanceRepository,
);
export const createTransaction = new CreateTransaction(transactionRepository);
export const updatePortfolio = new UpdatePortfolio(
  shareRepository,
  createShare,
  updateShare,
  createMonthlyBalance,
  updateMonthlyBalance,
);

export const institutionController = new InstitutionController(getInstitution);

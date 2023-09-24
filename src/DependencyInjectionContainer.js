import Database from './infrastructure/database/Database.js';
import InstitutionController from './api/institution/InstitutionController.js';

import GetInstitution from './application/useCases/GetInstitution.js';
import CreateShare from './application/useCases/CreateShare.js';
import UpdateShare from './application/useCases/UpdateShare.js';
import UpdatePortfolio from './application/useCases/UpdatePortfolio.js';
import CreateBalance from './application/useCases/CreateBalance.js';
import CreateTransaction from './application/useCases/CreateTransaction.js';
import GetBalance from './application/useCases/GetBalance.js';
import UpdateBalance from './application/useCases/UpdateBalance.js';

import InstitutionRepository from './infrastructure/repositories/InstitutionRepository.js';
import ShareRepository from './infrastructure/repositories/ShareRepository.js';
import TransactionRepository from './infrastructure/repositories/TransactionRepository.js';
import BalanceRepository from './infrastructure/repositories/BalanceRepository.js';

export const database = Database.getInstance();

export const institutionRepository = new InstitutionRepository(database);
export const shareRepository = new ShareRepository(database);
export const transactionRepository = new TransactionRepository(database);
export const balanceRepository = new BalanceRepository(database);

export const getInstitution = new GetInstitution(institutionRepository);
export const createShare = new CreateShare(shareRepository);
export const updateShare = new UpdateShare(shareRepository);
export const createBalance = new CreateBalance(balanceRepository);
export const getBalance = new GetBalance(balanceRepository);
export const updateBalance = new UpdateBalance(balanceRepository);
export const createTransaction = new CreateTransaction(transactionRepository);
export const updatePortfolio = new UpdatePortfolio(
  shareRepository,
  createShare,
  updateShare,
  updateBalance,
);

export const institutionController = new InstitutionController(getInstitution);

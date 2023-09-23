import Database from './infrastructure/database/Database.js';
import InstitutionController from './api/institution/InstitutionController.js';

import GetInstitution from './application/useCases/GetInstitution.js';
import CreateShare from './application/useCases/CreateShare.js';
import UpdateShare from './application/useCases/UpdateShare.js';
import UpdateInstitutionPosition from './application/useCases/UpdateInstitutionPosition.js';

import InstitutionRepository from './infrastructure/repositories/InstitutionRepository.js';
import ShareRepository from './infrastructure/repositories/ShareRepository.js';
import TransactionRepository from './infrastructure/repositories/TransactionRepository.js';

export const database = Database.getInstance();

export const institutionRepository = new InstitutionRepository(database);
export const shareRepository = new ShareRepository(database);
export const transactionRepository = new TransactionRepository(database);

export const getInstitution = new GetInstitution(institutionRepository);
export const createShare = new CreateShare(shareRepository);
export const updateShare = new UpdateShare(shareRepository);
export const updateInstitutionPosition = new UpdateInstitutionPosition(
  institutionRepository,
  shareRepository,
  createShare,
  updateShare,
);

export const institutionController = new InstitutionController(getInstitution);

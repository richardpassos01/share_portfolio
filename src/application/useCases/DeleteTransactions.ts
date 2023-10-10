import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class DeleteTransactions {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(institutionId: string, ids: string[]): Promise<void> {
    return this.transactionRepository.delete(institutionId, ids);
  }
}

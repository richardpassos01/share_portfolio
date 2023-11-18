import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import { injectable, inject } from 'inversify';

@injectable()
export default class ListTicketSymbols {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(institutionId: string): Promise<string[]> {
    return this.transactionRepository.listTicketSymbols(institutionId);
  }
}

import { injectable, inject } from 'inversify';
import TotalBalance from '../../domain/totalBalance/TotalBalance';
import { TYPES } from '@constants/types';
import TotalBalanceRepositoryInterface from '@domain/totalBalance/interfaces/TotalBalanceRepositoryInterface';
import { AbstractTransaction } from '@domain/shared/interfaces';

@injectable()
export default class CreateTotalBalance {
  constructor(
    @inject(TYPES.TotalBalanceRepository)
    private readonly totalBalanceRepository: TotalBalanceRepositoryInterface,
  ) {}

  async execute(transaction: AbstractTransaction): Promise<void> {
    const totalBalance = new TotalBalance(transaction.getInstitutionId());

    return this.totalBalanceRepository.create(totalBalance);
  }
}

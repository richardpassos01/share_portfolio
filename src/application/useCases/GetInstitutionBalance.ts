import { TYPES } from '@constants/types';
import { injectable, inject } from 'inversify';
import GetTotalBalance from './GetTotalBalance';
import MonthlyBalanceRepositoryInterface from '@domain/monthlyBalance/interfaces/MonthlyBalanceRepositoryInterface';
import InstitutionBalance from '@domain/institution/interfaces/InstitutionBalance';

@injectable()
export default class GetInstitutionBalance {
  constructor(
    @inject(TYPES.MonthlyBalanceRepository)
    private readonly monthlyBalanceRepository: MonthlyBalanceRepositoryInterface,

    @inject(TYPES.GetTotalBalance)
    private readonly getTotalBalance: GetTotalBalance,
  ) {}

  async execute(institutionId: string): Promise<InstitutionBalance> {
    const { earnings } =
      await this.monthlyBalanceRepository.sumEarnings(institutionId);

    const balance = await this.getTotalBalance.execute(institutionId);
    const profit = Math.max(0, earnings - balance.getLoss());

    const institutionBalance: InstitutionBalance = {
      profit,
      loss: balance.getLoss(),
    };

    return institutionBalance;
  }
}

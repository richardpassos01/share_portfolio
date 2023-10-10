export const TYPES = {
  Database: Symbol.for('Database'),
  InstitutionRepository: Symbol.for('InstitutionRepositoryInterface'),
  MonthlyBalanceRepository: Symbol.for('MonthlyBalanceRepositoryInterface'),
  ShareRepository: Symbol.for('ShareRepositoryInterface'),
  TotalBalanceRepository: Symbol.for('TotalBalanceRepositoryInterface'),
  TransactionRepository: Symbol.for('TransactionRepositoryInterface'),
  InstitutionController: Symbol.for('InstitutionController'),
  TransactionController: Symbol.for('TransactionController'),
  FinancialReportController: Symbol.for('FinancialReportController'),
  CreateShare: Symbol.for('CreateShare'),
  CreateTransactions: Symbol.for('CreateTransactions'),
  DeleteTransactions: Symbol.for('DeleteTransactions'),
  ListTransactions: Symbol.for('ListTransactions'),
  GetInstitution: Symbol.for('GetInstitution'),
  CreateInstitution: Symbol.for('CreateInstitution'),
  GetShare: Symbol.for('GetShare'),
  ListShares: Symbol.for('ListShares'),
  GetTotalBalance: Symbol.for('GetTotalBalance'),
  CreateOrUpdateMonthlyBalance: Symbol.for('CreateOrUpdateMonthlyBalance'),
  UpdatePortfolio: Symbol.for('UpdatePortfolio'),
  UpdateOrLiquidateShare: Symbol.for('UpdateOrLiquidateShare'),
  CreateOrUpdateTotalBalance: Symbol.for('CreateOrUpdateTotalBalance'),
  ProcessDividendTransaction: Symbol.for('ProcessDividendTransaction'),
  ProcessSpecialEventsOnShare: Symbol.for('ProcessSpecialEventsOnShare'),
  ProcessTradeTransaction: Symbol.for('ProcessTradeTransaction'),
  ProcessBuyTransaction: Symbol.for('ProcessBuyTransaction'),
  ProcessSellTransaction: Symbol.for('ProcessSellTransaction'),
  ListTradeTransactionsFromMonth: Symbol.for('ListTradeTransactionsFromMonth'),
  FinancialReport: Symbol.for('FinancialReport'),
  GetMonthlyBalance: Symbol.for('GetMonthlyBalance'),
  CreateFinancialReportFromBalances: Symbol.for(
    'CreateFinancialReportFromBalances',
  ),
  UpdateBalancesFromFinancialReport: Symbol.for(
    'UpdateBalancesFromFinancialReport',
  ),
  CalculateTotalBalanceEarning: Symbol.for('CalculateTotalBalanceEarning'),
  SyncPortfolio: Symbol.for('SyncPortfolio'),
};

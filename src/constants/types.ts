export const TYPES = {
  Database: Symbol.for('Database'),
  InstitutionRepository: Symbol.for('InstitutionRepositoryInterface'),
  MonthlyBalanceRepository: Symbol.for('MonthlyBalanceRepositoryInterface'),
  ShareRepository: Symbol.for('ShareRepositoryInterface'),
  TotalBalanceRepository: Symbol.for('TotalBalanceRepositoryInterface'),
  TransactionRepository: Symbol.for('TransactionRepositoryInterface'),
  InstitutionController: Symbol.for('InstitutionController'),
  TransactionController: Symbol.for('TransactionController'),
  BalanceManagementController: Symbol.for('BalanceManagementController'),
  CreateShare: Symbol.for('CreateShare'),
  CreateTransactions: Symbol.for('CreateTransactions'),
  DeleteTransactions: Symbol.for('DeleteTransactions'),
  ListTransactions: Symbol.for('ListTransactions'),
  GetInstitution: Symbol.for('GetInstitution'),
  CreateInstitution: Symbol.for('CreateInstitution'),
  GetShare: Symbol.for('GetShare'),
  ListShares: Symbol.for('ListShares'),
  GetTotalBalance: Symbol.for('GetTotalBalance'),
  UpdatePortfolio: Symbol.for('UpdatePortfolio'),
  UpdateShare: Symbol.for('UpdateShare'),
  ProcessDividendTransaction: Symbol.for('ProcessDividendTransaction'),
  ListTradeTransactionsFromMonth: Symbol.for('ListTradeTransactionsFromMonth'),
  BalanceController: Symbol.for('BalanceController'),
  GetMonthlyBalance: Symbol.for('GetMonthlyBalance'),
  ListMonthlyBalance: Symbol.for('ListMonthlyBalance'),
  UpdateBalances: Symbol.for('UpdateBalances'),
  ReSyncPortfolio: Symbol.for('ReSyncPortfolio'),
  BalanceManagementFactory: Symbol.for('BalanceManagementFactory'),
};

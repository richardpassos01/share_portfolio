import { TRANSACTION_TYPE } from '../../domain/transaction/TransactionEnums.js';

const calculateOperationResult = (share, transaction) => {
  const sellCost = transaction.totalCost;
  const minIdealSellCost = transaction.quantity * share.mediumPrice;
  const winsOrLoss = sellCost - minIdealSellCost;
  return winsOrLoss;
};

export default class UpdateInstitutionPosition {
  constructor(shareRepository, createShare, updateBalance) {
    this.shareRepository = shareRepository;
    this.createShare = createShare;
    this.updateBalance = updateBalance;
  }

  async execute(transaction) {
    try {
      const balance = await this.getOrCreateBalance(
        transaction.institutionId,
        transaction.date,
      );

      const share = await this.getOrCreateShare(
        transaction.ticketSymbol,
        transaction.institutionId,
        transaction,
      );

      if (transaction.type === TRANSACTION_TYPE.SELL) {
        await this.handleSellOperation(transaction, balance, share);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleSellOperation(transaction, balance, share) {
    const operationResult = calculateOperationResult(share, transaction);

    const transactions =
      await this.transactionRepository.getSellTransactionFromPeriod(
        transaction.date,
      );

    balance.setType(transactions);

    if (operationResult < 0) {
      balance.setLoss(operationResult);
    }

    if (operationResult > 0) {
      balance.setWins(operationResult);
      balance.calculateTaxes(transactions);
    }

    await this.updateBalance.execute(balance);

    return this.handleLiquidation();
  }

  async handleLiquidation(transaction) {
    const share = await this.shareRepository.get(
      transaction.ticketSymbol,
      transaction.institutionId,
    );

    if (share.quantity === 0) {
      return this.shareRepository.delete(share);
    }
  }

  async getOrCreateBalance(institutionId, date) {
    const balance = await this.getBalance.execute(institutionId, date);
    if (!balance) {
      return this.createBalance.execute(institutionId, date);
    }
    return balance;
  }

  async getOrCreateShare(ticketSymbol, institutionId, transaction) {
    const share = await this.shareRepository.get(ticketSymbol, institutionId);
    if (!share) {
      return this.createShare.execute(transaction);
    }
    return share;
  }
}

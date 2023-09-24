import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../domain/transaction/TransactionEnums.js';

const calculateOperationResult = (share, transaction) => {
  const sellCost = transaction.totalCost;
  const minIdealSellCost = transaction.quantity * share.mediumPrice;
  const winsOrLoss = sellCost - minIdealSellCost;
  return winsOrLoss;
};

export default class UpdatePortfolio {
  constructor(shareRepository, createShare, updateShare, updateBalance) {
    this.shareRepository = shareRepository;
    this.createShare = createShare;
    this.updateShare = updateShare;
    this.updateBalance = updateBalance;
  }

  async execute(transaction) {
    try {
      // when buy share, just need to create balance and share if not exists;
      const balance = await this.getOrCreateBalance(transaction);

      if (transaction.category === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.handleDividends(transaction, balance);
      }

      const share = await this.getOrCreateShare(transaction);

      if (transaction.category === TRANSACTION_CATEGORY.OTHER) {
        return this.handleStocksSplits(transaction, share);
      }

      if (transaction.type === TRANSACTION_TYPE.SELL) {
        return this.handleSellOperation(transaction, balance, share);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleStocksSplits(transaction, share) {
    share.updatePosition(transaction);
    return this.updateShare.execute(share);
  }

  async handleDividends(transaction, balance) {
    balance.setWins(transaction.totalCost);
    return this.updateBalance.execute(balance);
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
      balance.calculateTaxes(transactions, totalBalanceLoss);

      // create new table totalbalance, ou account_balance, com total_loss, total_win,
      // pegar total_loss da conta, descontar valor da taxes,
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

  async getOrCreateBalance({ institutionId, date }) {
    const balance = await this.getBalance.execute(institutionId, date);
    if (!balance) {
      return this.createBalance.execute(institutionId, date);
    }
    return balance;
  }

  async getOrCreateShare(transaction) {
    const share = await this.shareRepository.get(
      transaction.ticketSymbol,
      transaction.institutionId,
    );

    if (!share) {
      return this.createShare.execute(transaction);
    }

    return share;
  }
}

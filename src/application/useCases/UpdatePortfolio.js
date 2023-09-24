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
  constructor(
    shareRepository,
    createShare,
    updateShare,
    createMonthlyBalance,
    updateMonthlyBalance,
  ) {
    this.shareRepository = shareRepository;
    this.createShare = createShare;
    this.updateShare = updateShare;
    this.createMonthlyBalance = createMonthlyBalance;
    this.updateMonthlyBalance = updateMonthlyBalance;
  }

  async execute(transaction) {
    try {
      // when buy share, just need to create balance and share if not exists;
      const monthlyBalance = await this.getOrCreateMonthlyBalance(transaction);

      if (transaction.category === TRANSACTION_CATEGORY.DIVIDENDS) {
        return this.handleDividends(transaction, monthlyBalance);
      }

      const share = await this.getOrCreateShare(transaction);

      if (transaction.category === TRANSACTION_CATEGORY.OTHER) {
        return this.handleStocksSplits(transaction, share);
      }

      if (transaction.type === TRANSACTION_TYPE.SELL) {
        return this.handleSellOperation(transaction, monthlyBalance, share);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleStocksSplits(transaction, share) {
    share.updatePosition(transaction);
    return this.updateShare.execute(share);
  }

  async handleDividends(transaction, monthlyBalance) {
    monthlyBalance.setWins(transaction.totalCost);
    return this.updateMonthlyBalance.execute(monthlyBalance);
  }

  async handleSellOperation(transaction, monthlyBalance, share) {
    const operationResult = calculateOperationResult(share, transaction);

    const transactions =
      await this.transactionRepository.getSellTransactionFromPeriod(
        transaction.date,
      );

    monthlyBalance.setType(transactions);

    if (operationResult < 0) {
      monthlyBalance.setLoss(operationResult);
    }

    if (operationResult > 0) {
      monthlyBalance.setWins(operationResult);
      monthlyBalance.calculateTaxes(transactions); // totalBalanceLoss

      // create new table totalbalance, ou account_balance, com total_loss, total_win,
      // pegar total_loss da conta, descontar valor da taxes,
    }

    await this.updateMonthlyBalance.execute(monthlyBalance);

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

  async getOrCreateMonthlyBalance({ institutionId, date }) {
    const monthlyBalance = await this.getMonthlyBalance.execute(
      institutionId,
      date,
    );
    if (!monthlyBalance) {
      return this.createMonthlyBalance.execute(institutionId, date);
    }
    return monthlyBalance;
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

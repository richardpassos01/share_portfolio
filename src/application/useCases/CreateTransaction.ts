import Transaction from '../../domain/transaction/Transaction';

export default class CreateTransaction {
  constructor(transactionRepository, updatePortfolio) {
    this.transactionRepository = transactionRepository;
    this.updatePortfolio = updatePortfolio;
  }

  async execute({
    institutionId,
    type,
    date,
    category,
    ticketSymbol,
    quantity,
    unityPrice,
    totalCost,
  }) {
    const transaction = new Transaction({
      institutionId,
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalCost,
    });

    await this.transactionRepository.create(transaction);
    return this.updatePortfolio.execute(transaction);
  }
}

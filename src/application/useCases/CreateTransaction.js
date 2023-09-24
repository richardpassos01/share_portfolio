import Transaction from '../../domain/transaction/Transaction.js';

export default class createTransaction {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute({
    institutionId,
    type,
    date = new Date(),
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
    return transaction;
  }
}

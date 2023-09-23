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
    totalPrice,
  }) {
    const transaction = new Transaction({
      institutionId,
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalPrice,
    });

    return this.transactionRepository.create(transaction);
  }
}

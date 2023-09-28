import Transaction from '../../src/domain/transaction/Transaction.js';
import { dateToString } from '../../src/helpers/Helpers.js';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '../../src/domain/transaction/TransactionEnums.js';

import { transactionRepository } from '../../src/DependencyInjectionContainer';

export default class TransactionFactory {
  constructor(
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type = TRANSACTION_TYPE.BUY,
    date = new Date(),
    category = TRANSACTION_CATEGORY.TRADE,
    ticketSymbol = 'TSLA',
    quantity = 100,
    unityPrice = 10,
    totalCost = 1000,
  ) {
    this.transaction = new Transaction({
      id,
      institutionId,
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalCost,
    });
  }

  get() {
    return this.transaction;
  }

  getObject() {
    return {
      id: this.transaction.getId(),
      institutionId: this.transaction.getInstitutionId(),
      type: this.transaction.getType(),
      date: dateToString(this.transaction.getDate())
        .split('-')
        .reverse()
        .join('-')
        .replace(/-/g, '/'),
      category: this.transaction.getCategory(),
      ticketSymbol: this.transaction.getTicketSymbol(),
      quantity: this.transaction.getQuantity(),
      unityPrice: this.transaction.getUnityPrice(),
      totalCost: this.transaction.getTotalCost(),
    };
  }

  async save() {
    return transactionRepository.create(this.user);
  }
}

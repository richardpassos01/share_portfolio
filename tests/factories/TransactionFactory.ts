import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import Transaction from '@domain/transaction/Transaction';
import { dateToString } from '@helpers';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
} from '@domain/shared/constants';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';

type Params = {
  id?: string;
  institutionId: string;
  type: TRANSACTION_TYPE;
  date: Date;
  category: TRANSACTION_CATEGORY;
  ticketSymbol: string;
  quantity: number;
  unityPrice: number;
  totalCost: number;
}

export default class TransactionFactory {
  private transaction: Transaction;

  constructor({
    id,
    institutionId = 'c1daef5f-4bd0-4616-bb62-794e9b5d8ca2',
    type = TRANSACTION_TYPE.BUY,
    date = new Date(new Date().setHours(0, 0, 0, 0)),
    category = TRANSACTION_CATEGORY.TRADE,
    ticketSymbol = 'TSLA',
    quantity = 100,
    unityPrice = 10,
    totalCost = 1000,
  } = {} as Params) {
    this.transaction = new Transaction(
      institutionId,
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalCost,
      id,
    );
  }

  get() {
    return this.transaction;
  }

  getObject() {
    return {
      institutionId: this.transaction.getInstitutionId(),
      type: this.transaction.getType(),
      date: this.transaction.getDate(),
      category: this.transaction.getCategory(),
      ticketSymbol: this.transaction.getTicketSymbol(),
      quantity: this.transaction.getQuantity(),
      unityPrice: this.transaction.getUnityPrice(),
      totalCost: this.transaction.getTotalCost(),
    };
  }

  getPayloadObject() {
    const transaction = this.getObject();
    const date = dateToString(this.transaction.getDate())
      .split('-')
      .reverse()
      .join('-')
      .replace(/-/g, '/');

    return {
      ...transaction,
      date
    };
  }

  async save() {
    const transactionRepository = container.get<TransactionRepositoryInterface>(TYPES.TransactionRepository);
    return transactionRepository.create(this.transaction);
  }
}

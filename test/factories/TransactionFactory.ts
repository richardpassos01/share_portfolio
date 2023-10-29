import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Transaction from '@domain/transaction/Transaction';
import { dateStringToDate, dateToString } from '@helpers';
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@domain/shared/enums';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import institution from '@fixtures/institution';

type Params = {
  id?: string;
  institutionId?: string;
  type?: TRANSACTION_TYPE;
  date?: Date | string;
  category?: TRANSACTION_CATEGORY;
  ticketSymbol?: string;
  quantity?: number;
  unityPrice?: number;
  totalCost?: number;
};

export default class TransactionFactory {
  private transaction: Transaction;

  constructor(
    {
      id,
      institutionId = institution.id,
      type = TRANSACTION_TYPE.BUY,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      category = TRANSACTION_CATEGORY.TRADE,
      ticketSymbol = 'TSLA',
      quantity = 100,
      unityPrice = 10,
      totalCost = 1000,
    } = {} as Params,
    transaction?: Transaction,
  ) {
    const transactioDate = date instanceof Date ? date : dateStringToDate(date);

    this.transaction =
      transaction ||
      new Transaction(
        institutionId,
        type,
        transactioDate,
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
      institutionId: this.transaction.institutionId,
      type: this.transaction.type,
      date: this.transaction.date,
      category: this.transaction.category,
      ticketSymbol: this.transaction.ticketSymbol,
      quantity: this.transaction.quantity,
      unityPrice: this.transaction.unityPrice,
      totalCost: this.transaction.totalCost,
    };
  }

  getCreatePayload() {
    const { institutionId: _, ...transaction } = this.getObject();
    const date = dateToString(this.transaction.date);

    return {
      ...transaction,
      date,
    };
  }

  getDeletePayload(ids?: string[]) {
    return [ids ?? this.transaction.id];
  }

  async save() {
    const transactionRepository = container.get<TransactionRepositoryInterface>(
      TYPES.TransactionRepository,
    );
    return transactionRepository.createMany([this.transaction]);
  }
}

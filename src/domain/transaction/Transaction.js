import { uuid } from 'uuidv4';

export default class Transaction {
  constructor({
    id = uuid(),
    institutionId,
    type,
    date,
    category,
    ticketSymbol,
    quantity,
    unityPrice,
    totalPrice,
  }) {
    Object.assign(this, {
      id,
      institutionId,
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalPrice,
    });
  }
}

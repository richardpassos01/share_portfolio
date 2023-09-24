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
    totalCost,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.type = type;
    this.date = date;
    this.category = category;
    this.ticketSymbol = ticketSymbol;
    this.quantity = quantity;
    this.unityPrice = unityPrice;
    this.totalCost = totalCost;
  }
}

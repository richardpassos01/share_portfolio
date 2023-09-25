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

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getType() {
    return this.type;
  }

  getDate() {
    return this.date;
  }

  getCategory() {
    return this.category;
  }

  getTicketSymbol() {
    return this.ticketSymbol;
  }

  getQuantity() {
    return this.quantity;
  }

  getUnityPrice() {
    return this.unityPrice;
  }

  getTotalCost() {
    return this.totalCost;
  }
}

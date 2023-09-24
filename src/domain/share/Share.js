import { v4 as uuid } from 'uuid';
import { SHARE_OPERATION_TYPE } from './ShareEnums.js';

export default class Share {
  constructor({
    id = uuid(),
    institutionId,
    ticketSymbol,
    quantity,
    totalCost,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.ticketSymbol = ticketSymbol;
    this.quantity = quantity;
    this.totalCost = totalCost;
    this.mediumPrice = this.setMediumPrice();
  }

  getId() {
    return this.id;
  }

  getInstitutionId() {
    return this.institutionId;
  }

  getTicketSymbol() {
    return this.ticketSymbol;
  }

  getQuantity() {
    return this.quantity;
  }

  getTotalCost() {
    return this.totalCost;
  }

  getMediumPrice() {
    return this.mediumPrice;
  }

  setTotalCost(cost) {
    this.totalCost += cost;
  }

  setQuantity(quantity) {
    this.quantity += quantity;
  }

  setMediumPrice() {
    this.mediumPrice = this.totalCost / this.quantity;
  }

  updatePosition({ quantity, totalCost, type }) {
    const operationMultiplier = type === SHARE_OPERATION_TYPE.BUY ? 1 : -1;

    this.setQuantity(quantity * operationMultiplier);
    this.setTotalCost(totalCost * operationMultiplier);
    this.setMediumPrice();
  }
}

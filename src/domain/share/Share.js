import { uuid } from 'uuidv4';
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

  updatePosition({ quantity, totalCost, type }) {
    const operationMultiplier = type === SHARE_OPERATION_TYPE.BUY ? 1 : -1;

    this.setQuantity(quantity * operationMultiplier);
    this.setTotalCost(totalCost * operationMultiplier);
    this.setMediumPrice();
  }

  setTotalCost(cost) {
    this.totalCost += cost;
  }

  setQuantity(quantity) {
    this.quantity += quantity;
  }

  getMediumPrice() {
    return this.mediumPrice;
  }

  setMediumPrice() {
    this.mediumPrice = this.totalCost / this.quantity;
  }
}

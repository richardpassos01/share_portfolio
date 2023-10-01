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
    this.setMediumPrice();
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

  setQuantity(quantity) {
    this.quantity = Math.max(0, quantity);
  }

  setTotalCost(totalCost) {
    this.totalCost = Math.max(0, totalCost);
  }

  setMediumPrice() {
    this.mediumPrice = this.quantity > 0 ? this.totalCost / this.quantity : 0;
  }

  updatePosition({ quantity, totalCost, type }) {
    const isBuyOperation = type === SHARE_OPERATION_TYPE.BUY;
    const changeMultiplier = isBuyOperation ? 1 : -1;

    this.setQuantity((this.quantity += changeMultiplier * quantity));
    this.setTotalCost((this.totalCost += changeMultiplier * totalCost));
    this.setMediumPrice();
  }
}

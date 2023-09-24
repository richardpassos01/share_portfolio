import { uuid } from 'uuidv4';
import { SHARE_OPERATION_TYPE } from './ShareEnums.js';

export default class Share {
  constructor({
    id = uuid(),
    institutionId,
    ticketSymbol,
    quantity,
    totalCost,
    mediumPrice,
  }) {
    this.id = id;
    this.institutionId = institutionId;
    this.ticketSymbol = ticketSymbol;
    this.quantity = quantity;
    this.totalCost = totalCost;
    this.mediumPrice = mediumPrice;
  }

  updatePosition({ quantity, price, operationType }) {
    const operationMultiplier =
      operationType === SHARE_OPERATION_TYPE.BUY ? 1 : -1;

    this.updateQuantity(quantity * operationMultiplier);
    this.updateTotalCost(price * operationMultiplier);
    this.updateMediumPrice();
  }

  updateTotalCost(cost) {
    this.totalCost += cost;
  }

  updateQuantity(quantity) {
    this.quantity += quantity;
  }

  updateMediumPrice() {
    this.mediumPrice = this.totalCost / this.quantity;
  }
}

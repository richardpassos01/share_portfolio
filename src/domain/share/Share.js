import { uuid } from 'uuidv4';

export default class Share {
  constructor({
    id = uuid(),
    institutionId,
    ticketSymbol,
    quantity,
    totalCost,
    mediumPrice,
  }) {
    Object.assign(this, {
      id,
      institutionId,
      ticketSymbol,
      quantity,
      totalCost,
      mediumPrice,
    });
  }

  updateTotalCost(cost) {
    this.totalCost += cost;
  }

  updateQuantity(quantitySharesPurchased) {
    this.quantity += quantitySharesPurchased;
  }

  updateMediumPrice() {
    this.mediumPrice = this.totalCost / this.quantity;
  }
}

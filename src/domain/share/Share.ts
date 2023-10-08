import { v4 as uuid } from 'uuid';
import { TRANSACTION_TYPE } from '@domain/shared/enums';
import { AbstractTransaction } from '@domain/shared/interfaces';

export default class Share {
  private mediumPrice = 0;

  constructor(
    private readonly institutionId: string,
    private readonly ticketSymbol: string,
    private quantity: number,
    private totalCost: number,
    private readonly id: string = uuid(),
  ) {
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

  setQuantity(quantity: number) {
    this.quantity = Math.max(0, quantity);
  }

  setTotalCost(totalCost: number) {
    this.totalCost = Math.max(0, totalCost);
  }

  setMediumPrice() {
    this.mediumPrice = this.quantity > 0 ? this.totalCost / this.quantity : 0;
  }

  updatePosition(quantity: number, totalCost: number, type: TRANSACTION_TYPE) {
    const isBuyOperation = type === TRANSACTION_TYPE.BUY;
    const changeMultiplier = isBuyOperation ? 1 : -1;

    this.setQuantity((this.quantity += changeMultiplier * quantity));
    this.setTotalCost((this.totalCost += changeMultiplier * totalCost));
    this.setMediumPrice();
  }

  getEarningsOrLoss(transaction: AbstractTransaction): number {
    const sellCost = transaction.getTotalCost();
    const minIdealSellCost = transaction.getQuantity() * this.mediumPrice;
    const earning = sellCost - minIdealSellCost;
    return earning;
  }
}

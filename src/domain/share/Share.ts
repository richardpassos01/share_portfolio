import { v4 as uuid } from 'uuid';
import { TRANSACTION_TYPE } from '@domain/shared/enums';
import { TransactionDTO } from '@domain/shared/types';

export default class Share {
  public mediumPrice = 0;

  constructor(
    public readonly institutionId: string,
    public readonly ticketSymbol: string,
    public quantity: number,
    public totalCost: number,
    public readonly id: string = uuid(),
  ) {
    this.setMediumPrice();
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

  getEarningOrLoss(transaction: TransactionDTO): number {
    const sellCost = transaction.totalCost;
    const minIdealSellCost = transaction.quantity * this.mediumPrice;
    const earning = sellCost - minIdealSellCost;
    return earning;
  }
}

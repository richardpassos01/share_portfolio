import { v4 as uuid } from 'uuid';
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import { TransactionDTO } from '@domain/shared/types';

export default class Share {
  constructor(
    public readonly institutionId: string,
    public readonly ticketSymbol: string,
    public quantity: number,
    public totalCost: number,
    public mediumPrice: number,
    public readonly id: string = uuid(),
  ) {}

  setQuantity(quantity: number) {
    this.quantity = Math.max(0, quantity);
  }

  setTotalCost(totalCost: number) {
    this.totalCost = Math.max(0, totalCost);
  }

  setMediumPrice(isBuyOperation: boolean) {
    const shareHasNoCost = this.quantity === 0 || this.totalCost === 0;

    if (shareHasNoCost) {
      this.mediumPrice = 0;
      return;
    }

    if (isBuyOperation) {
      this.mediumPrice = this.totalCost / this.quantity;
    }
  }

  updatePosition({ quantity, totalCost, type, category }: TransactionDTO) {
    const isTradeOperation = category === TRANSACTION_CATEGORY.TRADE;
    const isBuyOperation = type === TRANSACTION_TYPE.BUY;
    const changeMultiplier = isBuyOperation ? 1 : -1;

    if (isTradeOperation) {
      this.setTotalCost((this.totalCost += changeMultiplier * totalCost));
    }

    this.setQuantity((this.quantity += changeMultiplier * quantity));
    this.setMediumPrice(isBuyOperation);
  }

  getEarningOrLoss({ totalCost, quantity }: TransactionDTO): number {
    const targetSellCost = quantity * this.mediumPrice;
    return totalCost - targetSellCost;
  }
}

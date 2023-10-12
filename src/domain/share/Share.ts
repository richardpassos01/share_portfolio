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

  setMediumPrice() {
    this.mediumPrice = this.quantity > 0 ? this.totalCost / this.quantity : 0;
  }

  updatePosition({ quantity, totalCost, type, category }: TransactionDTO) {
    const isTradeOperation = category === TRANSACTION_CATEGORY.TRADE;
    const isBuyOperation = type === TRANSACTION_TYPE.BUY;
    const changeMultiplier = isBuyOperation ? 1 : -1;

    this.setQuantity((this.quantity += changeMultiplier * quantity));

    if (isTradeOperation) {
      this.setTotalCost((this.totalCost += changeMultiplier * totalCost));
    }

    if (isBuyOperation) {
      this.setMediumPrice();
    }
  }

  getEarningOrLoss({ totalCost, quantity }: TransactionDTO): number {
    const sellCost = totalCost;
    const minIdealSellCost = quantity * this.mediumPrice;
    const earning = sellCost - minIdealSellCost;
    return earning;
  }
}

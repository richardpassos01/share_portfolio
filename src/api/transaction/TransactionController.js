import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { dateStringToDate } from '../../helpers/Helpers.js';

export default class TransactionController {
  constructor(createTransaction) {
    this.createTransaction = createTransaction;
  }

  async create(req, res, next) {
    const { institutionId } = req.params;
    const {
      type,
      date,
      category,
      ticketSymbol,
      quantity,
      unityPrice,
      totalCost,
    } = req.body;

    return this.createTransaction
      .execute({
        institutionId,
        type,
        date: dateStringToDate(date),
        category,
        ticketSymbol,
        quantity,
        unityPrice,
        totalCost,
      })
      .then(() => res.status(StatusCodes.OK).send(ReasonPhrases.OK))
      .catch(next);
  }
}

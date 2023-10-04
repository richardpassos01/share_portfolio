import { StatusCodes } from 'http-status-codes';

export default class InstitutionController {
  constructor(getInstitution, getProfit) {
    this.getInstitution = getInstitution;
    this.getProfit = getProfit;
  }

  get(req, res, next) {
    const { institutionId } = req.params;

    return this.getInstitution
      .execute(institutionId)
      .then((institution) => res.status(StatusCodes.OK).send(institution))
      .catch(next);
  }

  profit(req, res, next) {
    const { institutionId } = req.params;

    return this.getProfit
      .execute(institutionId)
      .then((profit) => res.status(StatusCodes.OK).send(profit))
      .catch(next);
  }
}

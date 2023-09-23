import { StatusCodes } from 'http-status-codes';

export default class InstitutionController {
  constructor(getInstitution) {
    this.getInstitution = getInstitution;
  }

  get(req, res, next) {
    const { institutionId } = req.params;

    return this.getInstitution
      .execute(institutionId)
      .then((institution) => res.status(StatusCodes.OK).send(institution))
      .catch(next);
  }
}

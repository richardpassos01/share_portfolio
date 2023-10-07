import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import Joi from 'joi';

const createTransaction = Joi.object({
  institutionId: Joi.string().uuid().required(),
  type: Joi.string()
    .valid(...Object.values(TRANSACTION_TYPE))
    .required(),
  date: Joi.string().isoDate().required(),
  category: Joi.string()
    .valid(...Object.values(TRANSACTION_CATEGORY))
    .required(),
  ticketSymbol: Joi.string().required(),
  quantity: Joi.number().required(),
  unityPrice: Joi.number().required(),
  totalCost: Joi.number().required(),
});

export default { createTransaction };

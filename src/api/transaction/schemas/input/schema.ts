import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import Joi from 'joi';

const create = Joi.array()
  .min(1)
  .items(
    Joi.object({
      type: Joi.string()
        .valid(...Object.values(TRANSACTION_TYPE))
        .required(),
      date: Joi.date().iso().required(),
      category: Joi.string()
        .valid(...Object.values(TRANSACTION_CATEGORY))
        .required(),
      ticketSymbol: Joi.string().required(),
      quantity: Joi.number().required(),
      unityPrice: Joi.number().required(),
      totalCost: Joi.number().required(),
    }),
  );

const del = Joi.array().items(Joi.string().uuid()).min(1).required();

export default { create, del };

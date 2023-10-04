import * as Joi from 'joi';

const createTransaction = Joi.object({
  instituitionId: Joi.string().required(),
});

export { createTransaction };

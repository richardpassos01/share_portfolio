import Joi from 'joi';

const create = Joi.object({
  name: Joi.string().required(),
  userId: Joi.string().uuid().required(),
});

export default { create };

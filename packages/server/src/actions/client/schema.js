import Joi from 'joi'



export const mutateInsertOneSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required()
})

export const querySchema = Joi.object().keys({
  limit: Joi.number().min(1).max(100).default(20),
  name: Joi.string(),
  id: Joi.string(),
  fields: Joi.array().default(['status', 'name', 'id'])
}).xor(['name', 'id'])

export const mutateUpdateSchema = Joi.object().keys({
  name: Joi.string(),
  id: Joi.string(),
  clientId: Joi.string(),
  socketId: Joi.string().required(),
  toStatus: Joi.number().valid([1, 2]).required(),
  token: Joi.string().length(96),
})

export const queryOneSchema = Joi.object().keys({
  token: Joi.string().length(96),
  socketId: Joi.string(),
  clientId: Joi.string(),
  withSourceData: Joi.boolean().default(false)
}).xor(['token', 'clientId', 'socketId'])

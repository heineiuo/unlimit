const schema = Joi.object().keys({
  subject: Joi.object().keys({
    id: Joi.string(),
    type: Joi.string()
  }),
  object: Joi.object().keys({
    id: Joi.string(),
    type: Joi.string()
  }),
  predicate: Joi.string().required(),
  predicateData: Joi.object()
})

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  
})

import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required(),
  appToken: Joi.string().length(96).required()
}), {allowUnknown: true})

/**
 * get app detail
 * @returns {Promise}
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName, appToken} = validated.value;
  const {db} = getCtx()

  try {
    const apptokenDb = db.collection('apptoken');
    const detail = await apptokenDb.findOne({_id: appToken});
    resolve(detail)
  } catch(e){
    if (e.name !== 'NotFoundError') return reject(new Error('NO_SESSION'));
    reject(e)
  }
});

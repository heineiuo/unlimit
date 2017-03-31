import ShouldNotFound from './shouldNotFound'
import Joi from 'joi'

const create = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, Joi.object.keys({
    appName: Joi.string().required()
  }), {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const db = getCtx().db.sub('app');
  const {appName} = validated.value;

  try {
    const app = {
      appName,
      permission: [],
      list: []
    };
    await dispatch(ShouldNotFound)({appName});
    await db.put(appName, app);
    resolve(app)
  } catch(e){
    reject(e)
  }
});

export default module.exports = create
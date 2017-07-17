import removeSocket from '../session/unbind'
import Joi from 'joi'


export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required()
}), {allowUnknown: true})


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;

  try {
    const appDb = getCtx().db.collection('app');
    const detail = await appDb.findOneAndDelete({appName});

    await Promise.all(detail.list.map(item => {
      return new Promise(async (resolve, reject) => {
        if (item.socketId === '') return resolve();
        try {
          await dispatch(removeSocket({socketId: item.socketId}));
          resolve()
        } catch(e){
          reject(e)
        }
      })
    }));

    resolve(detail||{})
  } catch(e){
    reject(e)
  }
});

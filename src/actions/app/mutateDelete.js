import removeSocket from '../socket/unbind'
import getMongodb from '../../mongodb'
import Joi from 'joi'


export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required()
}), {allowUnknown: true})


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;

  try {
    const db = getCtx().leveldb.sub('app');
    const detail = await db.del(appName);

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

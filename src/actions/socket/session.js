import Joi from 'joi'
import getUserSession from '../account/session'
import getApp from '../app/queryLevelApp'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  socketId: Joi.string(),
  headers: Joi.object().required()
}), {allowUnknown: true});

/**
 * 根据socketId获取app信息
 * @returns {Promise}
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const {headers, socketId} = validated.value;
    const db = getCtx().leveldb.sub('socket');

    let session = null;
    if (headers.hasOwnProperty('switch-identity')) {
      const {appSecret, appId, appName} = headers['switch-identity'];
      if (appName === 'user') {
        try {
          session = await dispatch(getUserSession({token: appSecret}));
        } catch (e) {}
      } else {
        try {
          const result = await dispatch(getApp({appName, appId}));
          const targetApp = result.list.find(item => {
            return item.appId === appId && item.appSecret === appSecret
          });
          if (targetApp) {
            session = {...targetApp, appName}
          }
        } catch(e){}

      }
    } else {
      if (socketId) {
        session = await db.get(socketId, {valueEncoding: 'json'});
      }
    }

    resolve(session);
  } catch(e){
    if (e.name === 'NotFoundError') return reject(new Error('SOCKET_NOT_FOUND'));
    reject(e)
  }
});


import Joi from 'joi'
import {bindActionCreators, connect} from 'action-creator'
import getUserSession from '../token/session'
import getApp from '../app/get'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  socketId: Joi.string(),
  headers: Joi.object().required()
}), {allowUnknown: true});

/**
 * 根据socketId获取app信息
 * @returns {Promise}
 */
const session = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const {headers, socketId} = query;
    const db = ctx.db.socket;
    const {getUserSession, getApp} = getAction();

    let session = null;
    if (headers.hasOwnProperty('switch-identity')) {
      const {appSecret, appId, appName} = headers['switch-identity'];
      if (appName == 'user') {
        try {
          session = await getUserSession({token: appSecret});
        } catch (e) {}
      } else {
        try {
          const result = await getApp({appName, appId});
          const targetApp = result.list.find(item => {
            return item.appId == appId && item.appSecret == appSecret
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
    if (e.name == 'NotFoundError') return reject(new Error('SOCKET_NOT_FOUND'));
    reject(e)
  }
});


export default module.exports = connect(
  bindActionCreators({
    getUserSession,
    getApp
  })
)(session);
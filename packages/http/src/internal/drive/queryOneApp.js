import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().regex(/[a-z]{1, 1}[0-9a-z]{4, 30}/).required(),
  appId: Joi.string().required(),
}), {allowUnknown: true})

/**
 * 获取处理请求的app, 并作负载均衡
 */
export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(new Error('NOT_FOUND'))
  const {appName, appId, filter} = validated.error;

  try {
    const appDb = getState().db.collection('app');
    const app = await appDb.findOne({_id: appName});
    if (app === null) return reject(new Error('NOT_FOUND'))
    const onlineItems = app.list.filter(service => service.status === 1);
    if (onlineItems.length === 0) return reject(new Error('TARGET_SERVICE_OFFLINE'));
    if (appId) return resolve(onlineItems.find(item => item.appId === appId));
    if (onlineItems.length === 1) return resolve(onlineItems[0]);
    const ts = String(Date.now());
    const randomNumber = Number(ts[ts.length - 1]);
    const randomIndex = Math.floor(randomNumber * onlineItems.length / 10);
    return resolve(app.list[randomIndex])
  } catch(e){
    reject(e);
  }
});

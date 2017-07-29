import Joi from 'joi'
import queryOne from '../client/queryOne'
import queryClient from '../client/query'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appId: Joi.string(),
  appName: Joi.string().required(),
}), {allowUnknown: true})

/**
 * 如果有appId，那么返回的socketId必须和appId一致，否则返回null
 * 如果没有appId，默认随机返回一个
 * 如果没找到socketId（都不在线），则返回null
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  const {appName, appId} = validated.value;
  if (validated.error) return reject(validated.error)
  const {log} = getCtx()

  let socketId = null;
  try {
    if (appId) {
      socketId = await dispatch(queryOne({clientId: appId})).socketId
    } else {
      const {data} = await dispatch(queryClient({name: appName, fields: ['socketId']}))
      const result = data.find(item => item.socketId !== null)
      socketId = result ? result.socketId : null
    }
  } catch(e) {
    // log(e)
  }
  resolve({socketId})
})

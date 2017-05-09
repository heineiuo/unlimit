/* @private */

import Joi from 'joi'
import getLeveldb from '../../leveldb'
import queryOneUser from '../account/queryOne'
import queryOneApp from '../app/queryOne'
import getMongodb from '../../mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  token: Joi.string().length(96),
  socketId: Joi.string(),
  clientId: Joi.string(),
  withSourceData: Joi.boolean().default(false)
}).xor(['token', 'clientId', 'socketId']), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {clientId, socketId, token, withSourceData} = validated.value;

  try {
    const tokendb = (await getLeveldb()).sub('token')
    const mongodb = (await getMongodb()).collection('client')
    let client = await new Promise(async resolve => {
      try {
        resolve(await tokendb.get(token));
      } catch(e) {
        resolve(null)
      }
    })
    if (!client) {
      client = await mongodb.findOne({token});
    }
    if (!client) return reject(new Error('NOT_FOUND'));
    if (withSourceData){
      if (client.type === 'user') {
        client.user = await dispatch(queryOneUser({userId: client.id}))
        client.userId = client.id;
      } else {
        client.app = await dispatch(queryOneApp({appId: client.id, appName: client.name}))
      }
    }
    resolve(client)
  } catch(e){
    reject(e)
  }
})

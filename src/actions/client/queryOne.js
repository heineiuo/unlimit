/* @private */

import Joi from 'joi'
import queryOneUser from '../account/queryOne'
import queryOneApp from '../app/queryOne'
import {queryOneSchema} from './schema'

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryOneSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {clientId, socketId, token, withSourceData} = validated.value;

  try {
    const {db} = getCtx()
    const tokenDb = db.collection('token')
    const clientDb = db.collection('client')
    let client = await tokenDb.findOne({_id: token})
    if (!client) {
      client = await clientDb.findOne({token});
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

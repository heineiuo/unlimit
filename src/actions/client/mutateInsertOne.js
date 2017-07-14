/* @private */

import crypto from 'crypto'
import Joi from 'joi'
import {mutateInsertOneSchema} from './schema'

export const createSecret = () => crypto.randomBytes(48).toString('hex');

const mongodbSchema = Joi.object().keys({
  name: Joi.string(), 
  type: Joi.string(), 
  id: Joi.string(),
  token: Joi.string().default(createSecret, 'create token'),
  socketId: Joi.string().default(''),
  status: Joi.number().default(1)
})


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateInsertOneSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {type, name, id} = validated.value;
  const {getMongodb}  = getCtx()

  try {
    const mongo = (await getMongodb()).collection('client');
    const tokendb = (await getMongodb()).collection('token');
    const insertData = {
      name, type, id,
      token: createSecret(),
      socketId: null,
      status: 1 // 0, disable, 1, not online 2, online
    }
    const clientId = (await mongo.insertOne(insertData)).ops[0]._id.toString();
    await tokendb.insert({
      name, 
      type, 
      token: insertData.token, 
      id, 
      clientId
    })
    resolve({...insertData, clientId})
  } catch(e){
    console.log(e)
    reject(e)
  }
})

/* @private */

import crypto from 'crypto'
import Joi from 'joi'
import getMongodb from '../../mongodb'
import getLeveldb from '../../leveldb'

export const createSecret = () => crypto.randomBytes(48).toString('hex');

export const validate = query => Joi.validate(query, Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {type, name, id} = validated.value;

  try {
    const mongo = (await getMongodb()).collection('client');
    const leveldb = await getLeveldb()
    const tokendb = leveldb.sub('token')
    const insertData = {
      name, type, id,
      token: createSecret(),
      socketId: null,
      status: 1 // 0, disable, 1, not online 2, online
    }
    const clientId = (await mongo.insertOne(insertData)).ops[0]._id.toString();
    await tokendb.put(insertData.token, {name, type, token: insertData.token, id, clientId})
    resolve({...insertData, clientId})
  } catch(e){
    console.log(e)
    reject(e)
  }
})

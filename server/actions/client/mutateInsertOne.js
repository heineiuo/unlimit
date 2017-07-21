/* @private */

import crypto from 'crypto'
import Joi from 'joi'
import { mutateInsertOneSchema } from './schema'

export const createSecret = () => crypto.randomBytes(48).toString('hex');

const clientSchema = Joi.object().keys({
  name: Joi.string(),
  type: Joi.string(),
  id: Joi.string(),
  token: Joi.string().default(createSecret, 'create token'),
  socketId: Joi.string().default(''),
  status: Joi.number().default(1)
})


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateInsertOneSchema, { allowUnknown: true });
  if (validated.error) return reject(validated.error);
  const { type, name, id } = validated.value;

  try {
    const { db } = getCtx()
    const clientDb = db.collection('client');
    const tokenDb = db.collection('token')
    const insertData = {
      name, type, id,
      token: createSecret(),
      socketId: null,
      status: 1 // 0, disable, 1, not online 2, online
    }
    const clientId = (await clientDb.insertOne(insertData))._id;
    await tokenDb.insertOne({
      _id: insertData.token,
      name,
      type,
      token: insertData.token,
      id,
      clientId
    })
    resolve({ ...insertData, clientId })
  } catch (e) {
    reject(e)
  }
})

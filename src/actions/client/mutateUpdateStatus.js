/* @private */

import Joi from 'joi'
import getMongodb from "../../mongodb"
import getLeveldb from "../../leveldb"

const deleteLevelItem = (db, key) => new Promise(async resolve => {
  try {
    resolve(await db.del(key))
  } catch(e) {
    resolve()
  }
})

export const validate = query => Joi.validate(query, Joi.object().keys({
  name: Joi.string(),
  id: Joi.string(),
  clientId: Joi.string(),
  socketId: Joi.string().required(),
  toStatus: Joi.number().valid([1, 2]).required(),
  token: Joi.string().length(96),
}), {allowUnknown: true});

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {name, id, socketId, clientId, toStatus, token} = validated.value;

  try {
    const mongo = (await getMongodb()).collection('client')
    const socketdb = (await getLeveldb()).sub('socket')

    if (toStatus === 1) {
      const result = (await mongo.findOneAndUpdate({socketId}, {$set: {
        status: 1,
        socketId: null
      }}, {returnOriginal: false})).value
      await deleteLevelItem(socketdb, socketId)
      return resolve(result)
    }

    if (toStatus === 2) {
      const result = (await mongo.findOneAndUpdate({id, name, token}, {$set: {
        status: 2,
        socketId
      }}, {returnOriginal: false})).value

      await new Promise(async resolve => {
        try {
          resolve(await socketdb.put(socketId, {id, name}))
        } catch(e){
          reject(e)
        }
      })
      return resolve(result)
    }

  } catch (e) {
    reject(e)
  }
})


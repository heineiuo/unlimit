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
  toStatus: Joi.number().required(),
  token: Joi.string(),
}), {allowUnknown: true});

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {name, id, socketId, clientId, toStatus, token} = validated.value;

  try {
    const mongo = (await getMongodb()).collection('client')
    const socketdb = (await getLeveldb()).sub('socket')

    if (toStatus === 1) {
      await mongo.findOneAndUpdate({socketId}, {$set: {
        status: 1,
        socketId: null
      }})
      await deleteLevelItem(socketdb, socketId)
      return resolve({})
    }

    if (toStatus === 2) {
      const result = await mongo.findOneAndUpdate({id, name, token}, {$set: {
        status: 2,
        socketId
      }})

      console.log(result)

      await new Promise(async resolve => {
        socketdb.put(socketId, {id, name}).then(resolve).catch(resolve)
      })
      return resolve({})
    }

  } catch (e) {
    reject(e)
  }
})


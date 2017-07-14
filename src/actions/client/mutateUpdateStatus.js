/* @private */

import Joi from 'joi'
import {mutateUpdateSchema} from './schema'

/**
 * @param {number} query.toStatus 
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateUpdateSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {name, id, socketId, clientId, toStatus, token} = validated.value;
  const {getMongodb} = getCtx()

  try {
    const mongo = (await getMongodb()).collection('client')
    const socketdb = (await getMongodb()).collection('socket')

    if (toStatus === 1) {
      const results = await Promise.all([
        mongo.findOneAndUpdate(
          {socketId}, 
          {$set: {status: 1,socketId: null}}, 
          {returnOriginal: false}
        ),
        socketdb.findOneAndDelete({socketId})
      ])
      return resolve(results[0].value)
    }

    if (toStatus === 2) {
      const results = await Promise.all([
        mongo.findOneAndUpdate(
          {id, name, token},
          {$set: {status: 2,socketId}}, 
          {returnOriginal: false}
        ),
        socketdb.findOneAndUpdate({socketId}, {$set: {id, name}})
      ])
      return resolve(results[0].value)
    }

  } catch (e) {
    reject(e)
  }
})


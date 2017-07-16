/* @private */

import Joi from 'joi'
import {mutateUpdateSchema} from './schema'


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateUpdateSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {name, id, socketId, clientId, toStatus, token} = validated.value;

  try {
    const {db} = getCtx()
    const clientDb = db.collection('client')
    const socketDb = db.collection('socket')

    if (toStatus === 1) {
      const result = (await clientDb.findOneAndUpdate({socketId}, {$set: {
        status: 1,
        socketId: null
      }}, {returnOriginal: false})).value
      await socketDb.findOneAndRemove({_id: socketId})
      return resolve(result)
    }

    if (toStatus === 2) {
      const result = (await clientDb.findOneAndUpdate(
        {id, name, token}, 
        {$set: {status: 2,socketId}}, 
        {returnOriginal: false}
      )).value

      await new Promise(async resolve => {
        try {
          resolve(await socketDb.findOneAndUpdate({_id: socketId}, {$set: {id, name}}))
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


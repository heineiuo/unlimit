import Joi from 'joi'
import {ObjectId} from 'mongodb'
import getMongodb from '../../mongodb'

export const mutateDisableSchema = Joi.object().keys({
  driveId: Joi.string().required()
})

export default query => dispatch => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateDisableSchema, {allowUnknown: true})
  const {driveId} = validated.value;
  try {
    const drive = (await getMongodb()).collection('drive');
    await drive.findOneAndUpdate({_id: ObjectId(driveId)}, {$set: {status: 0}})
    resolve({ok: 'ok'})
  } catch(e){
    reject(e)
  }
})

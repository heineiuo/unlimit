import Joi from 'joi'
import {ObjectId} from 'mongodb'
import getMongodb from '../../mongodb'
import getLeveldb from '../../leveldb'
import {queryLevel} from '../account/queryOne'

export const validate = query => Joi.validate(query, Joi.object().keys({
  driveId: Joi.string(),
}), {allowUnknown: true})

export default query => (dispatch, geCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {driveId} = validated.value;
  try {
    const drive = (await getMongodb()).collection('drive');
    const filter = {_id: ObjectId(driveId)};
    const result = await drive.findOne(filter, {fields: {users: 1}})
    if (!result) return reject(new Error('NOT_FOUND'))
    const userdb = (await getLeveldb()).sub('user')
    let data = await Promise.all(result.users.map(userId => {
      return queryLevel(userdb, userId)
    }))
    data = data.filter(item => item !== null)
    resolve({data})
  } catch(e){
    reject(e)
  }
})
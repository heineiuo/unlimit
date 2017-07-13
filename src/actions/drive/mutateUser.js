import Joi from 'joi'
import {ObjectId} from 'mongodb'
import union from 'lodash/union'

const mutateUserScheme = Joi.object().keys({
  driveId: Joi.string().required(),
  add: Joi.array().default([]),
  remove: Joi.array().default([])
})

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateUserScheme, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId, add, remove} = validated.value;
  const {getMongodb, getLeveldb, getConfig} = getCtx()

  try {
    if (add.length > 0 || remove.length > 0) {
      const db = (await getMongodb()).collection('drive');
      const driveData = await db.findOne({_id: ObjectId(driveId)});
      if (!driveData) return reject(new Error('NOT_FOUND'))
      const currentUsers = driveData.users;
      const nextUsers = union(currentUsers.filter(item => !remove.includes(item)).concat(add));
      if (!nextUsers.includes(driveData.adminId)) return reject(new Error('CANNOT_DELETE_ADMIN'))
      await db.findOneAndUpdate({_id: ObjectId(driveId)}, {$set: {users: nextUsers}})
    }
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});

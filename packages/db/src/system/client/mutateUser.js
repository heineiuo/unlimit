import Joi from 'joi'
import union from 'lodash/union'

const mutateUserScheme = Joi.object().keys({
  driveId: Joi.string().required(),
  add: Joi.array().default([]),
  remove: Joi.array().default([])
})

export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateUserScheme, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId, add, remove} = validated.value;

  try {
    const {db} = getState()
    if (add.length > 0 || remove.length > 0) {
      const driveDb = db.collection('drive');
      const driveData = await driveDb.findOne({_id: driveId});
      if (!driveData) return reject(new Error('NOT_FOUND'))
      const currentUsers = driveData.users;
      const nextUsers = union(currentUsers.filter(item => !remove.includes(item)).concat(add));
      if (!nextUsers.includes(driveData.adminId)) return reject(new Error('CANNOT_DELETE_ADMIN'))
      await driveDb.findOneAndUpdate({_id: driveId}, {$set: {users: nextUsers}})
    }
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});

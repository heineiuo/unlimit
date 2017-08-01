import Joi from 'joi'

const queryUserSchema =  Joi.object().keys({
  driveId: Joi.string(),
})


export default query => (dispatch, geCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryUserSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId} = validated.value;
  try {
    const {db} = getCtx()
    const driveDb = db.collection('drive');
    const filter = {_id: driveId};
    const result = await driveDb.findOne(filter, {fields: {users: 1}})
    if (!result) return reject(new Error('NOT_FOUND'))
    const userDb = db.collection('user')
    let data = await Promise.all(result.users.map(userId => {
      return new Promise(resolve => userDb.findOne({_id: userId})
        .then(resolve)
        .catch(() => resolve(null))
      )
    }))
    data = data.filter(item => item !== null)
    resolve({data})
  } catch(e){
    reject(e)
  }
})

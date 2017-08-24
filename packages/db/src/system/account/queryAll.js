/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
export default (query) => (dispatch, getState) => new Promise(async (resolve,reject) => {
  try {
    const {db} = getState()
    const limit = query.limit || 20;
    const userDb = db.collection('user')
    const list = await userDb.find({}).limit(limit).toArray()
    resolve({list})

  } catch(e){
    reject(e)
  }
});


export const queryUsers = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const queryUserSchema =  Joi.object().keys({
    driveId: Joi.string(),
  })
  const validated = Joi.validate(query, queryUserSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId} = validated.value;
  try {
    const {db} = getState()
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

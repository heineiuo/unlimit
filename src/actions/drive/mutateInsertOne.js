import Joi from 'joi'
import queryOne from './queryOne'


const insertSchema = Joi.object().keys({
  name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9]{5,30}$/).required(),
  description: Joi.string().default(''),
})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, insertSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error)
  const {name, description} = validated.value;
  const {db, config} = getCtx()
  
  try {
    const {session} = getCtx().request.headers;
    if (!session) return reject(new Error('PERMISSION_DENIED'))
    const userId = session ? session.userId : '123';
    const driveData = await new Promise(async resolve => {
      try {
        resolve(await dispatch(queryOne({name})));
      } catch(e) {
        resolve(null)
      }
    })
    if (driveData) return reject(new Error('NAME_EXIST'));
    const driveDb = db.collection('drive');
    const result = await driveDb.insertOne({
      name,
      description,
      domains: [],
      locations: [],
      users: [userId],
      adminId: userId,
      status: 1, // 0 不启用， 1正常
    })
    resolve(result.ops[0])
  } catch(e){
    reject(e)
  }
})

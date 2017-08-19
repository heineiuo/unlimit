import Joi from 'joi'
import queryOne from './queryOne'


const insertSchema = Joi.object().keys({
  name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9]{3,30}$/).required(),
  description: Joi.string().default(''),
})

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, insertSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error)
  const {name, description} = validated.value;
  
  try {
    const {db} = getState()
    const {session} = getState().request.headers;
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
    resolve(result)
  } catch(e){
    reject(e)
  }
})

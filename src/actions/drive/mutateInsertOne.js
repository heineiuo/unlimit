import Joi from 'joi'
import queryOne from './queryOne'
import getMongodb from '../../mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().default(''),
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {name, description} = validated.value;
  try {
    const driveData = await dispatch(queryOne({name}));
    if (driveData) return reject(new Error('NAME_EXIST'));
    const drive = (await getMongodb()).collection('drive');
    const {session} = getCtx().request.headers;
    const userId = session ? session.userId : '123';
    const result = await drive.insertOne({
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
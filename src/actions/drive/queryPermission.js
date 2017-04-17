import Joi from 'joi'
import queryOne from './queryOne'

export const validate = (query) => Joi.validate(query, Joi.object().keys({
  userId: Joi.string().required(),
  driveId: Joi.string().required(),
}), {allowUnknown: true});

/**
 * 获取空间和用户的权限关系
 * @param query
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {userId, driveId} = validated.value;
  try {
    const driveData = await dispatch(queryOne({driveId, fields:['users', 'adminId']}));
    if (!driveData) return reject(new Error('PERMISSION_DENIED'));
    if (driveData.users.includes(userId)) return resolve({success: 1})
    reject(new Error('PERMISSION_DENIED'));
  } catch(e){
    reject(e)
  }
});

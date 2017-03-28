import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  userId: Joi.string().required(),
  driveId: Joi.string().required(),
}), {allowUnknown: true});

/**
 * 获取空间和用户的权限关系
 * @param query
 */
const permission = (query) => (ctx, getActions) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {userId, driveId} = query;
    const db = ctx.db.sub('location');
    const location = await db.get(driveId);

    if (!location.hasOwnProperty('users') || location.users instanceof Array) {
      return reject(new Error('PERMISSION_DENIED'))
    }
    const userIndex = location.users.findIndex(item => item == userId);
    if (userIndex < 0) return reject(new Error('PERMISSION_DENIED'));
    resolve({success: 1})

  } catch(e){
    reject(e)
  }
});

module.exports = permission;
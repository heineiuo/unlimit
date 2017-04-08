import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  userId: Joi.string().required(),
  driveId: Joi.string().required(),
}), {allowUnknown: true});

/**
 * 获取空间和用户的权限关系
 * @param query
 */
const permission = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {userId, driveId} = query;
    const db = getCtx().leveldb.sub('location');
    const drive = await db.get(driveId);

    if (!drive.hasOwnProperty('users') || !drive.users instanceof Array) {
      return reject(new Error('PERMISSION_DENIED'))
    }
    if (drive.users.indexOf(userId) === -1) return reject(new Error('PERMISSION_DENIED'));
    resolve({success: 1})

  } catch(e){
    reject(e)
  }
});

module.exports = permission;
import Joi from 'joi'
import getUser from '../account/getUser'

export const validate = query => Joi.validate(query, Joi.object().keys({
  driveId: Joi.string().required()
}), {allowUnknown: true});

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {

  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {driveId} = validated.value;
    const db = getCtx().leveldb.sub('location');
    const location = await db.get(driveId);
    const list = await Promise.all(location.users.filter(user => user !== null).map(userId => {
      return dispatch(getUser({userId}))
    }))
    const admin = await dispatch(getUser({userId: location.adminId}))
    resolve({list, admin})
  } catch(e){
    reject(e)
  }

});

import bindDomain from './bindDomain'
import getDrive from './get'
import Joi from 'joi'

const getByHostname = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);
    const {hostname} = validated.value;
    const {driveId} = await dispatch(bindDomain)({hostname});
    const drive = await dispatch(getDrive)({driveId});
    resolve({driveId, ...drive})
  } catch(e){
    reject(e)
  }
});

export default module.exports = getByHostname
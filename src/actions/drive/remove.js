import unbindDomain from './unbindDomain'
import Joi from 'joi'

const destroy = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required()
    }));
    const db = getCtx().leveldb.sub('location');
    const {driveId} = validated.value;
    const drive = await db.get(driveId);
    await Promise.all(drive.hostnames.map(hostname => dispatch(unbindDomain({hostname}))));
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = destroy
import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  hostname: Joi.string().required(),
  driveId: Joi.string()
}), {allowUnknown: true});

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {hostname} = validated.value;
    let driveId = validated.value.driveId || null;
    const db = getCtx().leveldb.sub('domain');
    if (!driveId) {
      driveId = await db.get(hostname);
    } else {
      await db.put(hostname, driveId);
    }
    resolve({driveId, hostname});
  } catch(e){
    reject(e)
  }
});

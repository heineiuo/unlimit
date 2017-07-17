import Joi from 'joi'



export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  fileName: Joi.string().required()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {fileId, fileName} = validated.value;
  const {db, config} = getCtx()
  try {
    const fileDb = db.collection('file');
    const fileData = await fileDb.findOne({_id: fileId});
    if (!fileData) return reject(new Error('NOT_FOUND'));
    const {parentId, driveId, name} = fileData;
    if (name === fileName) return resolve({});
    const sameName = await fileDb.findOne({driveId, parentId, name: fileName});
    if (sameName) return reject(new Error('NAME_CONFLICT'));
    const result = await fileDb.findOneAndUpdate({_id: fileId}, {$set: {name: fileName}})
    resolve(result)
  } catch(e) {
    reject(e)
  }
})

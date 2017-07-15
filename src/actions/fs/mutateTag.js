import Joi from 'joi'


export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  tags: Joi.string().required()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {fileId, tags} = validated.value;
  const {db, config} = getCtx()

  try {
    const fileDb = db.collection('file')
    const result = await fileDb.findOneAndUpdate({_id: fileId}, {$set: {tags}})
    resolve(result)
  } catch(e){
    reject(e)
  }

})

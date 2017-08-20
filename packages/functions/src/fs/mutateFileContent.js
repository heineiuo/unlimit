import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  content: Joi.any()
}), {allowUnknown: true})

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {fileId, content} = validated.value;
  const {db} = getState()

  try {
    const fileContentDb = db.collection('fileContent')
    await fileContentDb.findOneAndUpdate({_id: fileId}, {$set: {data: content}})
    resolve({success: 1})
  } catch(e){
    reject(e)
  }
})

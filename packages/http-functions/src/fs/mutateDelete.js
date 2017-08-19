import Joi from 'joi'


const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  driveId: Joi.string()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {driveId, fileId} = validated.value;
  const {db} = getCtx()

  try {
    const fileDb = db.collection('file')
    const result = await fileDb.findOneAndDelete({_id: fileId})
    if (result.value.type === 1) {
      const fileContentDb = db.collection('fileContent')
      await fileContentDb.findOneAndDelete({_id: fileId})
    }
    resolve(result)
  } catch(e){
    reject(e)
  }
})

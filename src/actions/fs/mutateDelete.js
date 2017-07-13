import Joi from 'joi'
import {ObjectId} from 'mongodb'

const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  driveId: Joi.string()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {driveId, fileId} = validated.value;
  const {getMongodb, getLeveldb, getConfig} = getCtx()

  try {
    const filedb = (await getMongodb()).collection('file')
    const result = await filedb.findOneAndDelete({_id: ObjectId(fileId)})
    if (result.value.type === 1) {
      const fileContentdb = (await getLeveldb()).sub('fileContent')
      await fileContentdb.del(fileId)
    }
    resolve(result)
  } catch(e){
    reject(e)
  }
})

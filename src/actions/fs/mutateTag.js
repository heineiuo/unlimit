import Joi from 'joi'
import {ObjectId} from 'mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  tags: Joi.string().required()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {fileId, tags} = validated.value;
  const {getMongodb, getLeveldb, getConfig} = getCtx()

  try {
    const filedb = (await getMongodb()).collection('file')
    const result = await filedb.findOneAndUpdate({_id: ObjectId(fileId)}, {$set: {tags}})
    resolve(result)
  } catch(e){
    reject(e)
  }

})

import Joi from 'joi'
import {ObjectId} from 'mongodb'


export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  content: Joi.any()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {fileId, content} = validated.value;
  const {leveldb} = getCtx()

  try {
    const fileContentdb = leveldb.sub('fileContent')
    await fileContentdb.put(fileId, content)
    resolve({success: 1})
  } catch(e){
    reject(e)
  }

})

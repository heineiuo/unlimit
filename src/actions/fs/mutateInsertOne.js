import queryOneByFullPath from './queryOneByFullPath'
import Joi from 'joi'
import getLeveldb from '../../leveldb'
import getMongodb from '../../mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  name: Joi.string().required(),
  parentId: Joi.string().allow(null).default(null),
  driveId: Joi.string().required(),
  content: Joi.any(),
  type: Joi.number().default(1), // 1 文件，2文件夹
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  let {driveId, type, parentId, name, content} = validated.value;

  try {
    const fileContent = (await getLeveldb()).sub('fileContent');
    const file = (await getMongodb()).collection('file');
    const result0 = await file.findOne({driveId, parentId, name});
    if (result0) {
      console.log(validated.value)
      console.log(result0)
      return reject(new Error('FILE_EXIST'));
    }
    const result = await file.insertOne({driveId, type, parentId, name})
    const id = result.insertedId.toString()
    if (type === 1) await fileContent.put(id, content)
    resolve(result.ops[0])
  } catch(e){
    reject(e)
  }
})
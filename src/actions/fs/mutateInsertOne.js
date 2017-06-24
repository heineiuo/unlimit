import queryOneByFullPath from './queryOneByFullPath'
import Joi from 'joi'
import syncIndexData from './syncIndexData'

export const validate = query => Joi.validate(query, Joi.object().keys({
  name: Joi.string().required(),
  parentId: Joi.string().allow(null).default(null),
  driveId: Joi.string().required(),
  content: Joi.any(),
  type: Joi.number().default(1), // 1 文件，2文件夹
}), {allowUnknown: true})

/**
 * 创建文件
 * 先检查文件是否已存在，如果已存在，则报错'File Exist'
 * 在mongodb里创建文件，
 * 并同步文件信息到leveldb - fileIndex, 
 *  同步文件内容到 leveldb - fileContent
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  let {driveId, type, parentId, name, content} = validated.value;

  const {leveldb, getMongodb, getConfig} = getCtx();
  try {
    const fileContent = leveldb.sub('fileContent');
    const file = (await getMongodb()).collection('file');
    const result0 = await file.findOne({driveId, parentId, name});
    if (result0) return reject(new Error('File Exist'));

    const result = await file.insertOne({driveId, type, parentId, name})
    const id = result.insertedId.toString()
    
    // await dispatch(syncIndexData())
    
    if (type === 1) await fileContent.put(id, content)
    resolve(result.ops[0])
  } catch(e){
    reject(e)
  }
})

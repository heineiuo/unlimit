import queryOneByFullPath from './queryOneByFullPath'
import Joi from 'joi'

export const schema = Joi.object().keys({
  name: Joi.string().required(),
  parentId: Joi.string().allow(null).default(null),
  driveId: Joi.string().required(),
  content: Joi.any(),
  type: Joi.number().default(1), // 1 文件，2文件夹
})

/**
 * 创建文件
 * 先检查文件是否已存在，如果已存在，则报错'File Exist'
 * 在file里创建文件，
 * 并同步文件信息到 fileIndex, 
 *  同步文件内容到 fileContent
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, schema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  let {driveId, type, parentId, name, content} = validated.value;
  const {db, config} = getCtx();

  try {
    const fileContentDb = db.collection('fileContent');
    const fileDb = db.collection('file');
    const result0 = await fileDb.findOne({driveId, parentId, name});
    if (result0) return reject(new Error('File Exist'));

    const result = await fileDb.insertOne({driveId, type, parentId, name})
    if (type === 1) await fileContentDb.findOneAndUpdate({_id: result._id}, {$set:{data: content}})
    resolve(result.ops[0])
  } catch(e){
    reject(e)
  }
})

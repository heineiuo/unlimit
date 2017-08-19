import queryOneByFullPath from './queryOneByFullPath'
import Joi from 'joi'
import isPlainObject from 'lodash/isPlainObject'

export const schema = Joi.object().keys({
  fullPath /*完整路径*/: Joi.string(),
  fileId /*文件对应的唯一id*/: Joi.string(),
  replaceWithIndexHTMLWhenIsFolder/*如果是文件夹，是否切换目标为文件夹目录下的`index.html`文件*/: Joi.boolean().default(true)
}).xor(['fullPath', 'fileId'])

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, schema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  let {fullPath, fileId, replaceWithIndexHTMLWhenIsFolder} = validated.value;
  const {db} = getState();
  try {
    const fileContentDb = db.collection('fileContent');

    /**
     * 如果根据fileId来获取内容，则必须传入fileId, 否则必须传入fullPath
     * 根据fullPath获取fileId, 再获取内容
     * 如果传入了fileId， 但fileId没有对应的内容，则返回普通错误`Not found`
     */
    
    if (!fileId) {
      const indexData = await dispatch(queryOneByFullPath({fullPath, replaceWithIndexHTMLWhenIsFolder}));
      if (!indexData || !!indexData.error || !indexData.fileId) {
        return reject(new Error('Not found'))
      }
      fileId = indexData.fileId
    }
    const fileContent = await fileContentDb.findOne({_id: fileId})
    if (!fileContent) return reject(new Error('Not found'))
    if (!isPlainObject(fileContent)) return resolve({isFile: true, cat: fileContent})
    return resolve({isFile: true, cat: fileContent.data || new Buffer([])})
  } catch(e){
    reject(e)
  }
})

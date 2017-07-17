import queryOneByFullPath from './queryOneByFullPath'
import Joi from 'joi'

export const schema = Joi.object().keys({
  fullPath /*完整路径*/: Joi.string(),
  fileId /*文件对应的唯一id*/: Joi.string(),
  replaceWithIndexHTMLWhenIsFolder/*如果是文件夹，是否切换目标为文件夹目录下的`index.html`文件*/: Joi.boolean().default(true)
}).xor(['fullPath', 'fileId']) 


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, schema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  let {fullPath, fileId, replaceWithIndexHTMLWhenIsFolder} = validated.value;
  const {db} = getCtx();
  try {
    const fileContentDb = db.collection('fileContent');

    /**
     * 如果根据fileId来获取内容，则必须传入fileId, 否则必须传入fullPath
     * 根据fullPath获取fileId, 再获取内容
     * 如果传入了fileId， 但fileId没有对应的内容，则返回普通错误`Not found`
     */
    
    if (!fileId) {
      const indexData = await dispatch(queryOneByFullPath({fullPath, replaceWithIndexHTMLWhenIsFolder}));
      if (!indexData) return reject(new Error('Not found'))
      fileId = indexData.fileId
    }
    const fileContent = await fileContentDb.findOne({_id: fileId})
    if (fileContent === null) return reject(new Error('Not found'))
    resolve({isFile: true, cat: fileContent.content})
  } catch(e){
    reject(e)
  }
})

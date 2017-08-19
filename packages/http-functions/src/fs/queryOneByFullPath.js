import Joi from 'joi'
import ms from 'ms'
import trimEnd from 'lodash/trimEnd'
import syncIndexData from './syncIndexData'

export const validate = query => Joi.validate(query, Joi.object().keys({
  fullPath: Joi.string(), // include driveId
  replaceWithIndexHTMLWhenIsFolder: Joi.boolean().default(false)
}), {allowUnknown: true})



/**
 * 根据文件路径获取文件信息
 * 
 * 
 * TODO 关于批量修改路径后，同步数据的问题，有以下几个方案
 * 方案1： 最终同步、懒同步
 * 考虑到一个路径和对应的文件id只会存在3种情况，所以可以通过以下逻辑处理
 * 1. 路径不存在（则fileId一定不存在），即文件未创建，或已经被删除
 * 2. 路径存在，fileId存在，且路径和fildId中保存的路径一致，说明文件已同步成功
 * 3. 路径存在，fileId存在，但fileId中存储的路径和这个不一致（file中存储的肯定正确），说明这个路径有误，
 *   立即删除该路径，同步新路径。
 * 
 * 方案2： 立即同步
 * 略
 * 
 * 方案3： 重构索引
 * 将一个路径对应一个file的情况，改成一个路径对应多个file
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  let {fullPath, replaceWithIndexHTMLWhenIsFolder} = validated.value;

  /**
   * 所有的路径都以 '/' 开头， 以 '非/' 结尾 
   */
  fullPath = trimEnd(fullPath, '/')

  const {db} = getCtx()

  try {
    const fileIndexDb = db.collection('fileIndex')

    const findAndCheckUpdate = (fullPath) => new Promise(async resolve => {
      try {
        const { CACHE_EXPIRE_TIME } = process.env
        let indexData = await fileIndexDb.findOne({_id: fullPath})
        if (!indexData || !indexData.updateTime) {
          indexData = await dispatch(syncIndexData({fullPath}))
        } else if (indexData.updateTime > Date.now() + ms(CACHE_EXPIRE_TIME)) {
          indexData = await dispatch(syncIndexData({fullPath}))
        }
        resolve(indexData)
      } catch(e){
        resolve({error: e.name, message: e.message})
      }
    })

    let indexData = await findAndCheckUpdate(fullPath)
    if (indexData.type === 1 || !replaceWithIndexHTMLWhenIsFolder) return resolve(indexData)
    fullPath = `${fullPath}/index.html`
    indexData = await findAndCheckUpdate(fullPath)
    return resolve(indexData)

  } catch(e) {
    reject(e)
  }
})

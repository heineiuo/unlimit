import getLevel from '../../leveldb'
import getMongodb from '../../mongodb'
import getConfig from '../../config'
import Joi from 'joi'
import ms from 'ms'

const queryLevel = (db, key) => new Promise(async (resolve, reject) => {
  try {
    resolve(await db.get(key))
  } catch(e){
    resolve(null)
  }
})

export const validate = query => Joi.validate(query, Joi.object().keys({
  fullPath: Joi.string(), // include driveId
  replaceWithIndexHTMLWhenIsFolder: Joi.boolean().default(false)
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  let {fullPath, replaceWithIndexHTMLWhenIsFolder} = validated.value;

  const syncIndexData = (fullPath) => new Promise(async resolve => {
    try {
      const fileIndex = (await getLevel()).sub('fileIndex')
      const file = (await getMongodb()).collection('file')
      const paths = fullPath.split('/').filter(item => item !== '')
      if (paths.length === 1) return resolve({name: paths[0], type: 2})
      const driveId = paths.shift();
      let indexData = null;
      let parentId = null;
      /**
       * 从左往右，一级目录一级目录查询，直到目标文件
       * @param driveId
       */
      const walkDirToFind = (driveId) => new Promise(async (resolve, reject) => {
        try {
          const name = paths.shift();
          let fields = [];
          if (paths.length === 0) fields = fields.concat(['tags', 'type']);
          const result = await file.findOne({driveId, name, parentId}, {fields});
          if (!result) return reject(new Error('NOT_FOUND'));
          result.fileId = result._id.toString();
          if (paths.length === 0) return resolve(result);
          parentId = result.fileId;
          resolve(await walkDirToFind(driveId))
        } catch(e){
          reject(e)
        }
      })
      try {
        indexData = await walkDirToFind(driveId);
      } catch(e){
        indexData = {error: 'NOT_FOUND'}
      }
      indexData = {...indexData, updateTime: Date.now()}
      await fileIndex.put(fullPath, indexData)
      resolve(indexData)

    } catch(e){
      resolve({error: 'NOT_FOUND'})
    }
  })

  try {
    const fileIndex = (await getLevel()).sub('fileIndex')
    const {cacheExpireTime} = (await getConfig()).production
    let indexData = await queryLevel(fileIndex, fullPath)
    if (!indexData || Date.now() > indexData.updateTime + ms(cacheExpireTime) || !indexData.updateTime) {
      indexData = await syncIndexData(fullPath)
    }
    if (indexData.error) return reject(new Error(indexData.error));
    if (indexData.type === 2 && replaceWithIndexHTMLWhenIsFolder) {
      fullPath = `${fullPath}/index.html`
      indexData = await syncIndexData(fullPath)
    }
    resolve(indexData)
  } catch(e) {
    reject(e)
  }
})
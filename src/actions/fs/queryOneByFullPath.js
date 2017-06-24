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

  const {leveldb, getConfig, getMongodb} = getCtx()

  try {
    const fileIndex = leveldb.sub('fileIndex')
    let indexData = await queryLevel(fileIndex, fullPath)
    
    // if (!indexData || Date.now() > indexData.updateTime + ms(cacheExpireTime) || !indexData.updateTime) {
    //   indexData = await syncIndexData(fullPath)
    // }

    // if (indexData.error) return reject(new Error(indexData.error));
    if (indexData.type === 2 && replaceWithIndexHTMLWhenIsFolder) {
      fullPath = `${fullPath}/index.html`
      indexData = await syncIndexData(fullPath)
    }
    resolve(indexData)
  } catch(e) {
    reject(e)
  }
})

import queryOneByFullPath from './queryOneByFullPath'
import Joi from 'joi'
import getLeveldb from '../../leveldb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  fullPath: Joi.string(),
  fileId: Joi.string(),
}).xor(['fullPath', 'fileId']), {allowUnknown: true})

const queryLevel = (db, key) => new Promise(async resolve => {
  try {
    resolve(await db.get(key))
  } catch (e) {
    resolve(null)
  }
})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  let {fullPath, fileId} = validated.value;
  try {
    const fileContentdb = (await getLeveldb()).sub('fileContent');
    let indexData = null;
    if (!fileId) {
      indexData = await dispatch(queryOneByFullPath({
        fullPath, replaceWithIndexHTMLWhenIsFolder: true
      }));
      if (!indexData) return reject(new Error('NOT_FOUND'))
      fileId = indexData.fileId
    }
    const cat = await fileContentdb.get(fileId);
    return resolve({isFile: true, cat})
  } catch(e){
    reject(e)
  }
})
import Joi from 'joi'
import getMongodb from '../../mongodb'
import {ObjectId} from 'mongodb'

export const walkToBuildPrevFullPath = (currentPath, fileId) => new Promise(async (resolve, reject) => {
  try {
    const file = (await getMongodb()).collection('file');
    const fileData = await file.findOne({_id: ObjectId(fileId)})
    const {name, parentId} = fileData;
    currentPath = `${name}/${currentPath}`;
    if (parentId) return resolve(await walkToBuildPrevFullPath(currentPath, parentId))
    resolve(currentPath)
  } catch(e) {
    reject(e)
  }
})

export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  includePath: Joi.boolean().default(false)
}))

export default query => dispatch => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {includePath, fileId} = validated.value;

  try {
    const file = (await getMongodb()).collection('file')
    const fileData = await file.findOne({_id: ObjectId(fileId)})
    if (!fileData) return reject(new Error('NOT_FOUND'))
    if (includePath) {
      let {name, parentId} = fileData
      if (fileData.parentId) {
        name = await walkToBuildPrevFullPath(name, parentId)
      }
      fileData.fullPath = `/${fileData.driveId}/${name}`
    }
    resolve(fileData)
  } catch(e){
    reject(e)
  }
})
import Joi from 'joi'


export const walkToBuildPrevFullPath = (currentPath, fileId, fileDb) => new Promise(async (resolve, reject) => {
  try {
    const fileData = await fileDb.findOne({_id: fileId})
    const {name, parentId} = fileData;
    currentPath = `${name}/${currentPath}`;
    if (parentId) return resolve(await walkToBuildPrevFullPath(currentPath, parentId, fileDb))
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
  const {db, config} = getCtx()
  
  try {
    const fileDb = db.collection('file')
    const fileData = await fileDb.findOne({_id: fileId})
    if (!fileData) return reject(new Error('NOT_FOUND'))
    if (includePath) {
      let {name, parentId} = fileData
      if (fileData.parentId) {
        name = await walkToBuildPrevFullPath(name, parentId, fileDb)
      }
      fileData.fullPath = `/${fileData.driveId}/${name}`
    }
    resolve(fileData)
  } catch(e){
    reject(e)
  }
})

import Joi from 'joi'
import ms from 'ms'
import trimEnd from 'lodash/trimEnd'
import path from 'path'
import isPlainObject from 'lodash/isPlainObject'
import { match, when } from 'match-when'

const defaultState = {
  
}

export default (state=defaultState, action) => match(action.type, {
  [when()]: state
})

/**
 * 根据路径获取文件
 * 从左往右，一级目录一级目录查询（根据父文件夹id及该文件文件名），直到目标文件，
 * 找到目标文件后返回文件信息(id, parentId, name)
 * 找不到则返回错误信息'NOT_FOUND'
 * @param paths {array} ['path', 'to', 'file']
 * @param fileDb {object} db.collection('file')
 * @param parentId {string}
 * @param driveId {string}
 */
const walkLeftToRight = (paths, fileDb, parentId, driveId) => new Promise(async (resolve, reject) => {
  try {
    const name = paths.shift()
    let fields = []
    if (paths.length === 0) fields = fields.concat(['tags', 'type'])
    const result = await fileDb.findOne({driveId, name, parentId}, {fields})
    if (!result) return reject(new Error('NOT_FOUND'))
    result.fileId = result._id
    if (paths.length === 0) return resolve(result)
    parentId = result.fileId
    resolve(await walkLeftToRight(paths, fileDb, parentId, driveId))
  } catch(e){
    reject(e)
  }
})


/**
 * 根据完整的路径，获取文件的索引信息
 * 
 * file 里保存的是文件信息和文件之间的关系，是一个tree
 * fileIndex 里保存路径 -> 文件信息的键值对
 */
export const syncIndexData = ({fullPath}) => (dispatch, getState) => new Promise(async resolve => {
  const {db} = getState()
  let indexData = {error: 'NOT_FOUND', updateTime: Date.now()}
  
  try {
    const fileIndexDb = db.collection('fileIndex')
    const fileDb = db.collection('file')
    const paths = fullPath.split('/').filter(item => item !== '')
    if (paths.length < 1) return resolve({error: 'fullPath illegal'})
    indexData.driveId = paths.shift()
    
    if (paths.length === 0) {
      indexData.type = 2
    } else {
      const result = await walkLeftToRight(paths, fileDb, null, indexData.driveId)
      indexData.fileId = result._id,
      indexData.type = result.type
    }

    indexData.error = null
    await fileIndexDb.findOneAndUpdate({_id: fullPath}, {$set: indexData})
  } catch(e){
    console.log(e)
  } finally {
    resolve(indexData)
  }
})



/**
 * 根据局file id获取完整的路径
 */
const walkRightToLeft = (paths, filedb, id, driveId) => new Promise(async (resolve, reject) => {
  try {
    const result = await filedb.findOne({_id: id})
    if (result.parentId === null) return resulve(paths.join('/'))
    resolve(await walkRightToLeft(paths.unshift(result.name), filedb, result.parentId, driveId))
  } catch(e){
    reject(e)
  }
})

/**
 * 根据 [ 文件id, 父文件id和文件名 ] 更新索引
 * 先获取完整路径，再写入索引
 */
export const syncIndexDataByFile = ({file, fileId, driveId}) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const {db} = getState()
    const fileDb = db.collection('file')
    if (!file) {
      file = await fileDb.findOne({_id: fileId})
      if (!file) throw new Error('File not exist')
    }

    const indexData = {...file, updateTime: Date.now()}
    const fullPath = file.parentId === null ? 
      `/${driveId}/${file.name}` :
      await walkRightToLeft([file.name], fileDb, file._id, driveId)

    const fileIndexDb = db.collection('fileIndex')
    await fileIndexDb.insertOne({...indexData, _id: fullPath}, )
    resolve(file)

  } catch (e){
    reject(e)
  }
})





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
export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    fullPath: Joi.string(), // include driveId
    replaceWithIndexHTMLWhenIsFolder: Joi.boolean().default(false)
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  let {fullPath, replaceWithIndexHTMLWhenIsFolder} = validated.value

  /**
   * 所有的路径都以 '/' 开头， 以 '非/' 结尾 
   */
  fullPath = trimEnd(fullPath, '/')

  const {db} = getState()

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


export const delFile = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    fileId: Joi.string().required(),
    driveId: Joi.string()
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {driveId, fileId} = validated.value
  const {db} = getState()

  try {
    const fileDb = db.collection('file')
    const result = await fileDb.findOneAndDelete({_id: fileId})
    if (result.value.type === 1) {
      const fileContentDb = db.collection('fileContent')
      await fileContentDb.findOneAndDelete({_id: fileId})
    }
    resolve(result)
  } catch(e){
    reject(e)
  }
})

export const mutateFileContent = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    fileId: Joi.string().required(),
    content: Joi.any()
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {fileId, content} = validated.value
  const {db} = getState()

  try {
    const fileContentDb = db.collection('fileContent')
    await fileContentDb.findOneAndUpdate({_id: fileId}, {$set: {data: content}})
    resolve({success: 1})
  } catch(e){
    reject(e)
  }
})

export const mutateFileName = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    fileId: Joi.string().required(),
    fileName: Joi.string().required()
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {fileId, fileName} = validated.value
  const {db} = getState()
  try {
    const fileDb = db.collection('file')
    const fileData = await fileDb.findOne({_id: fileId})
    if (!fileData) return reject(new Error('NOT_FOUND'))
    const {parentId, driveId, name} = fileData
    if (name === fileName) return resolve({})
    const sameName = await fileDb.findOne({driveId, parentId, name: fileName})
    if (sameName) return reject(new Error('NAME_CONFLICT'))
    const result = await fileDb.findOneAndUpdate({_id: fileId}, {$set: {name: fileName}})
    resolve(result)
  } catch(e) {
    reject(e)
  }
})




/**
 * 创建文件
 * 先检查文件是否已存在，如果已存在，则报错'File Exist'
 * 在file里创建文件，
 * 并同步文件信息到 fileIndex, 
 *  同步文件内容到 fileContent
 */
export const putFile = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    parentId: Joi.string().allow(null).default(null),
    driveId: Joi.string().required(),
    content: Joi.any(),
    type: Joi.number().default(1), // 1 文件，2文件夹
  })
  const validated = Joi.validate(query, schema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  let {driveId, type, parentId, name, content} = validated.value
  const {db} = getState()

  try {
    const fileContentDb = db.collection('fileContent')
    const fileDb = db.collection('file')
    const result0 = await fileDb.findOne({driveId, parentId, name})
    if (result0) return reject(new Error('File Exist'))

    const result = await fileDb.insertOne({driveId, type, parentId, name})
    if (type === 1) await fileContentDb.findOneAndUpdate({_id: result._id}, {$set:{data: content}})
    resolve(result.ops[0])
  } catch(e){
    reject(e)
  }
})



export const mutateTag = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    fileId: Joi.string().required(),
    tags: Joi.string().required()
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {fileId, tags} = validated.value
  const {db} = getState()

  try {
    const fileDb = db.collection('file')
    const result = await fileDb.findOneAndUpdate({_id: fileId}, {$set: {tags}})
    resolve(result)
  } catch(e){
    reject(e)
  }

})


export const upload = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    driveId: Joi.string().required(),
    fileId: Joi.string(), // 如果有fileId, 那么name, parentId都失效
    name: Joi.string(),
    parentId: Joi.string().allow(null).default(null),
    uploadKey: Joi.string().default('file')
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {driveId, parentId, uploadKey, fileId, name} = validated.value
  getState().setHeader({__UPLOAD: true})

  try {
    resolve({parentId, driveId, uploadKey, fileId, name})
  } catch(e){
    reject(e)
  }
})


export const getFileInfo = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    keywords: Joi.string().default(''),
    tags: Joi.string().default(''),
    limit: Joi.number().default(200),
    driveId: Joi.string(),
    parentId: Joi.string().allow(null),
    replaceWithFileMetaIfIsFile: Joi.boolean().default(false),
    fields: Joi.array().default(['name', 'type']),
  }), {allowUnknown: true})
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {keywords, tags, limit, fields, parentId, driveId, replaceWithFileMetaIfIsFile} = validated.value
  const {db} = getState()
  try {
    const fileDb = db.collection('file')
    if (parentId) {
      const parentMeta = await fileDb.findOne({_id: parentId})
      if (!parentMeta) return reject(new Error('PARENT_NOT_EXIST'))
      if (parentMeta.type === 1) {
        if (replaceWithFileMetaIfIsFile) return resolve({...parentMeta, isFile: true})
        return reject(new Error('ILLEGAL_PARENT'))
      }
    }
    const keywordRegex = keywords.split(' ').join('|')
    const filter = {
      driveId,
      parentId,
      $or: []
    }

    if (tags) filter.$or.push({tags: {$regex: tags.split(',').join('|')}})
    if (keywords) {
      filter.$or.push({name: {$regex: keywordRegex}})
      filter.$or.push({tags: {$regex: keywordRegex}})
    }

    if (filter.$or.length === 0) delete filter.$or

    const data = await fileDb.find(filter, fields).limit(limit).toArray()
    resolve({data})
  } catch(e){
    return reject(e)
  }
})


export const walkToBuildPrevFullPath = (currentPath, fileId, fileDb) => new Promise(async (resolve, reject) => {
  try {
    const fileData = await fileDb.findOne({_id: fileId})
    const {name, parentId} = fileData
    currentPath = `${name}/${currentPath}`
    if (parentId) return resolve(await walkToBuildPrevFullPath(currentPath, parentId, fileDb))
    resolve(currentPath)
  } catch(e) {
    reject(e)
  }
})

export const queryOneById = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    fileId: Joi.string().required(),
    includePath: Joi.boolean().default(false)
  }))
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {includePath, fileId} = validated.value
  const {db} = getState()
  
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


export const getFileContent = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const schema = Joi.object().keys({
    fullPath /*完整路径*/: Joi.string(),
    fileId /*文件对应的唯一id*/: Joi.string(),
    replaceWithIndexHTMLWhenIsFolder/*如果是文件夹，是否切换目标为文件夹目录下的`index.html`文件*/: Joi.boolean().default(true)
  }).xor(['fullPath', 'fileId'])
  const validated = Joi.validate(query, schema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  let {fullPath, fileId, replaceWithIndexHTMLWhenIsFolder} = validated.value
  const {db} = getState()
  try {
    const fileContentDb = db.collection('fileContent')

    /**
     * 如果根据fileId来获取内容，则必须传入fileId, 否则必须传入fullPath
     * 根据fullPath获取fileId, 再获取内容
     * 如果传入了fileId， 但fileId没有对应的内容，则返回普通错误`Not found`
     */
    
    if (!fileId) {
      const indexData = await dispatch(queryOneByFullPath({fullPath, replaceWithIndexHTMLWhenIsFolder}))
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

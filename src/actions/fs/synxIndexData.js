/**
 * @private
 */

/**
 * 从左往右，一级目录一级目录查询，直到目标文件，
 * 找到目标文件后返回文件信息
 * 找不到则返回错误信息'NOT_FOUND'
 * @param driveId
 */

const walkDirToFind = (paths, file, parentId, driveId) => new Promise(async (resolve, reject) => {
  try {
    const name = paths.shift();
    let fields = [];
    if (paths.length === 0) fields = fields.concat(['tags', 'type']);
    const result = await file.findOne({driveId, name, parentId}, {fields});
    if (!result) return reject(new Error('NOT_FOUND'));
    result.fileId = result._id.toString();
    if (paths.length === 0) return resolve(result);
    parentId = result.fileId;
    resolve(await walkDirToFind(paths, file, parentId, driveId))
  } catch(e){
    reject(e)
  }
})

/**
 * 根据完整的路径，获取文件的索引信息
 * 
 * mongodb里保存的是文件信息和文件之间的关系，是一个tree
 * leveldb里保存路径 -> 文件信息的键值对
 */
export default (fullPath) => (dispatch, getCtx) => new Promise(async resolve => {

  const {leveldb, getMongodb} = getCtx()
  try {
    const fileIndex = leveldb.sub('fileIndex')
    const file = (await getMongodb()).collection('file')
    const paths = fullPath.split('/').filter(item => item !== '')
    if (paths.length === 1) return resolve({name: paths[0], type: 2})
    
    const driveId = paths.shift();
    let indexData = null;
    let parentId = null;

    try {
      indexData = await walkDirToFind(paths, file, parentId, driveId);
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

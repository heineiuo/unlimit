import path from 'path'
import filesystem from 'level-filesystem'

/**
 * 创建文件夹
 */
export default ({driveId, pathname}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const fs = filesystem(getCtx().leveldb.sub('fs'));
    await new Promise((resolve, reject) => {
      fs.mkdir(`${driveId}${pathname}`, (err) => {
        if (err) return reject(err);
        resolve()
      })
    });
    resolve({})
  } catch(e){
    reject(e)
  }
});

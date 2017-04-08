import path from 'path'
import filesystem from 'level-filesystem'

/**
 * 删除文件、文件夹
 */
const unlink = ({driveId, pathname}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const fs = filesystem(getCtx().leveldb.sub('fs'));
    await new Promise((resolve, reject) => {
      fs.unlink(`${driveId}${pathname}`, (err) => {
        if (err) return reject(err);
        resolve()
      })
    });

    resolve({})

  } catch(e){
    reject(e)
  }
});

export default module.exports = unlink;
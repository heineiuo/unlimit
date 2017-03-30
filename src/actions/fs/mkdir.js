import path from 'path'
import filesystem from 'level-filesystem'

/**
 * 创建文件夹
 */
const mkdir = ({driveId, pathname}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const fs = filesystem(ctx.db.sub('fs'));
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

export default module.exports = mkdir;
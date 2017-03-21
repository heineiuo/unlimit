import path from 'path'
import filesystem from 'level-filesystem'

/**
 * 创建文件夹
 */
const mkdir = ({hostname, pathname}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const fs = filesystem(ctx.db.file);
    await new Promise((resolve, reject) => {
      fs.mkdir(`${hostname}${pathname}`, (err) => {
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
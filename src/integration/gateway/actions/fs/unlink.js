import path from 'path'
import filesystem from 'level-filesystem'

/**
 * 删除文件、文件夹
 */
const unlink = ({hostname, pathname}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const fs = filesystem(ctx.db.file);
    await new Promise((resolve, reject) => {
      fs.unlink(`${hostname}${pathname}`, (err) => {
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
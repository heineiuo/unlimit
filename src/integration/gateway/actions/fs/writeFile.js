import path from 'path'
import filesystem from 'level-filesystem'

/**
 * @api {POST} /File/writeFile 修改文件
 * @apiGroup File
 * @apiName FileVi
 * @apiParam {string} token 令牌
 * @apiParam {string} file
 * @apiParam {string} content
 */
const writeFile = ({hostname, pathname, content='', noConflict=false}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const fs = filesystem(ctx.db.file);
    const realPath = `${hostname}${pathname}`;

    if (noConflict) {
      await new Promise((resolve, reject) => {
        fs.readFile(realPath, err => {
          if (err) return resolve();
          reject(new Error('FILE_EXIST'))
        })
      })
    }
    fs.writeFile(realPath, content, (err) => {
      if (err) return reject(err);
      resolve({})
    })
  } catch(e){
    console.log('WRITE FILE ERROR \n'+e.stack);
    reject(e)
  }
});

export default module.exports = writeFile
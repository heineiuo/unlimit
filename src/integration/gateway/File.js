
import fs from 'fs-promise';
import {Model} from 'sprucejs'
import mkdirp from 'mkdirp';
import config from '../../utils/config'

class File extends Model {

  initHostDir = (hostname) => new Promise(async (resolve, reject) => {
    mkdirp(`${config.datadir}/app/${hostname}/public`, (err) => {
      if (err) return reject(err)
      resolve()
    })
  });

  /**
   * @api {POST} /File/vi 修改文件
   * @apiGroup File
   * @apiName FileVi
   * @apiParam {string} token 令牌
   * @apiParam {string} file
   * @apiParam {string} content
   */
  vi = (req) => new Promise(async (resolve, reject) => {
    try {
      const {file, content} = req;
      await fs.writeFile(file, content, 'utf-8');
      resolve({})
    } catch(e){
      reject(e)
    }
  });

  /**
   * @api {POST} /File/mv 移动、重命名文件
   * @apiGroup File
   * @apiName FileMv
   * @apiParam {string} token 令牌
   * @apiParam {string} prevFile
   * @apiParam {string} nextFile
   */
  mv = (req) => new Promise(async (resolve, reject) => {
    try {
      const {prevFile, nextFile} = req;
      await fs.rename(prevFile, nextFile);
      resolve({})
    } catch(e){
      reject(e)
    }
  });

  /**
   * @api {POST} /File/ls 获取文件列表
   * @apiGroup File
   * @apiName FileLs
   * @apiParam {string} token 令牌
   * @apiParam {string} hostname
   * @apiParam {string} pathname
   */
  ls = (req) => new Promise(async (resolve, reject) => {
    try {
      const {pathname, hostname} = req;
      const prefix = `${config.datadir}/app/${hostname}`;
      const directory = `${prefix}${pathname}`;
      const files = await fs.readdir(directory);
      const stats = await Promise.all(files.map(file => {
        return fs.lstat(`${directory}/${file}`)
      }));
      const ls = files.map((name, index) => {
        const stat = stats[index];
        return {
          name,
          stat,
          isFile: stat.isFile(),
          isDirectory: stat.isDirectory(),
        }
      });
      resolve({ls})
    } catch(e){
      reject(new Error('ENOENT'))
    }
  });


  /**
   * @api {POST} /File/cat 获取文件内容
   * @apiGroup File
   * @apiName FileCat
   * @apiParam {string} token 令牌
   * @apiParam {string} host host
   * @apiParam {string} filename 文件路径
   * @apiSuccess {string} cat 内容
   */
  cat = (req) => new Promise(async (resolve, reject) => {
    try {
      const {host, filename} = req;
      const prefix = `${config.datadir}/app/${host}`;
      const cat = await fs.readFile(`${prefix}/${filename}`, 'utf-8');
      resolve({cat})
    } catch(e){
      reject(e)
    }
  });

  resolve(req){

    const {action} = req;
    if (action == 'cat') return this.cat(req);
    if (action == 'ls') return this.ls(req);
    if (action == 'mv') return this.mv(req);
    if (action == 'vi') return this.vi(req);
    return new Promise((resolve, reject) => reject(new Error('NOT_FOUND')))

  }
}


module.exports = File;

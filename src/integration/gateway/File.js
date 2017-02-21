
import fs from 'fs-promise'
import {Model} from 'sprucejs'
import mkdirp from 'mkdirp'
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
   * 创建文件夹
   */
  mkdir = () => new Promise(async (resolve, reject) => {
    try {
      reject(new Error('API_NOT_OK'))

    } catch(e){
      reject(e)
    }
  });

  /**
   * 删除文件、文件夹
   */
  rm = () => new Promise(async (resolve, reject) => {
    try {
      reject(new Error('API_NOT_OK'))
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
      resolve({
        isFile: false,
        ls
      })
    } catch(e){
      if (e.message.search('ENOTDIR:') == 0) {
        try {
          const file = await this.cat(req);
          resolve(file)
        } catch(e){
          reject(e)
        }

      } else {
        reject(new Error('ENOENT'))
      }
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
      const {hostname, pathname} = req;
      const prefix = `${config.datadir}/app/${hostname}`;
      const cat = await fs.readFile(`${prefix}/${pathname}`, 'utf-8');
      resolve({
        isFile: true,
        cat
      })
    } catch(e){
      reject(e)
    }
  });

  resolve(req){

    const {action} = req;
    if (action == 'cat') return this.cat(req);
    if (action == 'vi') return this.vi(req);
    if (action == 'ls') return this.ls(req);
    if (action == 'mkdir') return this.mkdir(req);
    if (action == 'rm') return this.rm(req);
    if (action == 'mv') return this.mv(req);
    return new Promise((resolve, reject) => reject(new Error('NOT_FOUND')))

  }
}


module.exports = File;


import fs from 'fs-promise';
import {Model} from 'sprucejs'
import config from '../../utils/config'

class File extends Model {

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
      if (config.debug) console.log(`${prefix}/${pathname}`);
      const ls = await fs.readdir(`${prefix}${pathname}`);
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
      const {db, reducers} = this.props;
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

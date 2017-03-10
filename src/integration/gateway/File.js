
import {Model} from 'sprucejs'
import path from 'path'
import filesystem from 'level-filesystem'

class File extends Model {

  /**
   * @api {POST} /File/mv 移动、重命名文件
   * @apiGroup File
   * @apiName FileMv
   * @apiParam {string} token 令牌
   * @apiParam {string} prevFile
   * @apiParam {string} nextFile
   */
  rename = (req) => new Promise(async (resolve, reject) => {
    try {
      const {hostname, prevFile, nextFile} = req;
      const fs = filesystem(this.props.db);
      await fs.rename(`${hostname}${prevFile}`, `${hostname}${nextFile}`);
      resolve({})
    } catch(e){
      reject(e)
    }
  });

  /**
   * 创建文件夹
   */
  mkdir = (req) => new Promise(async (resolve, reject) => {
    try {
      console.log(this);
      const {hostname, pathname} = req;
      const fs = filesystem(this.props.db);
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

  /**
   * 删除文件、文件夹
   */
  unlink = (req) => new Promise(async (resolve, reject) => {
    try {
      const {hostname, pathname} = req;
      const fs = filesystem(this.props.db);
      await new Promise((resolve, reject) => {
        fs.unlink(`${hostname}${pathname}`, (err) => {
          if (err) return reject(err)
          resolve()
        })
      });

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
      const fs = filesystem(this.props.db);
      const directory = `${hostname}${pathname}`;
      const files = await new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
          if (err) return reject(err);
          resolve(files)
        });
      });
      const stats = await Promise.all(files.map(filename => {
        return new Promise((resolve, reject) => {
          fs.lstat(`${directory}/${filename}`, (err, stat) => {
            if (err) return reject(err);
            resolve(stat);
          })
        })
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
      if (e.message.search('ENOTDIR') == 0 || e.message.search('ENOENT') == 0) {
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
      const fs = filesystem(this.props.db);
      fs.readFile(`${hostname}${pathname}`, (err, cat) => {
        if (err) {
          const lastParam = pathname.split('/').pop();
          if (lastParam.length =="" || !/\./.test(lastParam)) {
            fs.readFile(path.join(`${hostname}${pathname}`, 'index.html'), (err, cat) => {
              if (err) return reject(err);
              resolve({
                isFile: true,
                cat
              })
            });
          } else {
            reject(err);
          }
        } else {
          resolve({
            isFile: true,
            cat
          })
        }
      });

    } catch(e){
      reject(e)
    }
  });

  upload = (req) => new Promise(async (resolve, reject) => {
    try {
      const {hostname, pathname, isHashName=true} = req;
      const isPublic = pathname.search('/public') == 0;
      req.setHeader({
        __UPLOAD: true
      });
      resolve({
        uploadDir: `${hostname}${pathname}`,
        isPublic,
        isHashName,
        pathname,
        hostname,
        uploadLocation: `//${hostname}${pathname}`
      })
    } catch(e){
      console.log(e.stack);
      reject(e)
    }
  });

  /**
   * @api {POST} /File/writeFile 修改文件
   * @apiGroup File
   * @apiName FileVi
   * @apiParam {string} token 令牌
   * @apiParam {string} file
   * @apiParam {string} content
   */
  writeFile = (req) => new Promise(async (resolve, reject) => {
    try {
      const {hostname, pathname, filename, content} = req;
      const fs = filesystem(this.props.db);

      fs.writeFile(`${hostname}${pathname}`, content, (err) => {
        if (err) return reject(err);
        resolve({})
      })
    } catch(e){
      console.log(e.stack);
      reject(e)
    }
  });

  resolve(req){
    console.log(this.props);

    const {action} = req;
    if (action == 'cat') return this.cat(req);
    if (action == 'vi') return this.vi(req);
    if (action == 'ls') return this.ls(req);
    if (action == 'upload') return this.upload(req);
    if (action == 'mkdir') return this.mkdir(req);
    if (action == 'unlink') return this.unlink(req);
    if (action == 'writeFile') return this.writeFile(req);
    if (action == 'rename') return this.rename(req);
    return new Promise((resolve, reject) => reject(new Error('NOT_FOUND')))

  }
}


module.exports = File;

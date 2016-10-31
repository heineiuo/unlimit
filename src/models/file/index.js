/**
 * Copyright heineiuo
 */

import fs from 'fs';
import {Model} from '../../utils/spruce'
import config from '../../utils/config'

const File = new Model('File', {});


/**
 * @api {POST} /File/cat 获取文件内容
 * @apiGroup File
 * @apiName FileCat
 * @apiParam {string} host
 * @apiParam {string} filename
 * @apiSuccess {string} cat
 */
File.statics.cat = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    const {host, filename} = query;
    const prefix = `${config.datadir}/app/${host}`;
    const cat = await fs.readFile(`${prefix}/${filename}`, 'utf-8');
    resolve({cat})
  } catch(e){
    reject(e)
  }
});



/**
 * @api {POST} /File/ls 获取文件列表
 * @apiGroup File
 * @apiName FileLs
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 */
File.statics.ls = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    const {pathname, hostname} = query;
    const prefix = `${config.datadir}/app/${hostname}`;
    console.log(`${prefix}/${pathname}`);
    const ls = await fs.readdir(`${prefix}${pathname}`);
    resolve({ls})
  } catch(e){
    reject('ENOENT')
  }
})


/**
 * @api {POST} /File/mv 移动、重命名文件
 * @apiGroup File
 * @apiName FileMv
 * @apiParam {string} prevFile
 * @apiParam {string} nextFile
 */
File.statics.mv = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    const {prevFile, nextFile} = query;
    await fs.rename(prevFile, nextFile);
    resolve({})
  } catch(e){
    reject(e)
  }
});

/**
 * @api {POST} /File/vi 修改文件
 * @apiGroup File
 * @apiName FileVi
 * @apiParam {string} file
 * @apiParam {string} content
 */
File.statics.vi = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    const {file, content} = query;
    await fs.writeFile(file, contnet, 'utf-8')
    resolve({})
  } catch(e){
    reject(e)
  }
});



export default module.exports = File
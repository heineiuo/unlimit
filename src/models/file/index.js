/**
 * Copyright heineiuo
 */

import fs from 'fs';
import {Model} from '../../utils/spruce'
import config from '../../utils/config'
import Host from '../host'
import Location from '../location'

const File = new Model('File', {});


/**
 * @api {POST} /File/cat
 * @apiGroup File
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
 * @api {POST} /File/ls
 * @apiGroup File
 */
File.statics.ls = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    const {pathname, host_id} = query
    const {hostname} = await Host.findOne({_id: host_id})
    const prefix = `${config.datadir}/app/${hostname}`
    console.log(`${prefix}/${pathname}`)
    const ls = await fs.readdir(`${prefix}${pathname}`)
    resolve({ls})
  } catch(e){
    reject('ENOENT')
  }
})


/**
 * @api {POST} /File/mv
 * @apiGroup File
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
 * @api {POST} /File/vi
 * @apiGroup File
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
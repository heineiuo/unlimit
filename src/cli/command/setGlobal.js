import fs from 'fs-promise'
import path from 'path'
import {argv} from 'yargs'
import {homedir} from 'os'
import {CONFIG_FILE_PATH} from '../constants'
import queryGlobalConfig from '../queryGlobalConfig'
import {success} from '../show'

export default () => new Promise(async (resolve, reject) => {
  try {
    const key = argv._[2];
    const value = argv._[3];
    if (typeof key === 'undefined' || typeof value === 'undefined') {
      return reject(new Error('Arguments Error'))
    }
    const globalConfig = await queryGlobalConfig();
    globalConfig[key] = value;
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(globalConfig), 'utf8')
    success('Success')
    resolve()
  } catch(e){
    reject(e)
  }
})
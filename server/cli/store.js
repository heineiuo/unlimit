import fs from 'fs-promise'
import {homedir} from 'os'
import path from 'path'
import queryGlobalConfig from './queryGlobalConfig'

const walkToFindStore = (cwd) => new Promise(async (resolve, reject) => {
  try {
    const files = await fs.readdir(cwd);
    const target = files.find(file => file === '.drivestore')
    const parentDir = path.resolve(cwd, '..');
    if (!target) {
      if (cwd === homedir()) return reject(new Error('Cannot find drive instance, please use pnp clone YOUR_DRIVE_NAME first'))
      return resolve(await walkToFindStore(parentDir))
    }
    return resolve(JSON.parse(await fs.readFile(`${cwd}/${target}`, 'utf8')))
  } catch(e){
    reject(e)
  }
})

export default () => new Promise(async (resolve, reject) => {
  try {
    const globalConfig = await queryGlobalConfig();
    const rootDir = process.cwd();
    let store = await walkToFindStore(rootDir);
    store = {...store, globalConfig, rootDir}
    return resolve(store)
  } catch(e){
    reject(e)
  }
})
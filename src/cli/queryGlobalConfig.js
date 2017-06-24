import fs from 'fs-promise'
import mutateCreateConfig from './mutateCreateConfig'
import {homedir} from 'os'

let config = null;

export default () => new Promise(async (resolve, reject) => {
  if (config) return resolve(config)
  let configFile = null;
  try {
    configFile = await fs.readFile(`${homedir()}/.driveconfig`, 'utf8')
  } catch(e){
    try {
      configFile = await mutateCreateConfig()
    } catch(e){
      return reject(e)
    }
  }
  try {
    config = JSON.parse(configFile);
    resolve(config)
  } catch(e){
    reject(e)
  }
})
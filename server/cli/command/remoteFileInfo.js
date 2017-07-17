import {argv} from 'yargs'
import queryRemoteFile from '../queryRemoteFileMeta'
import path from 'path'
import getStore from '../store'
import {success, info} from '../show'

export default () => new Promise(async (resolve, reject) => {
  try {
    const {driveId, rootDir} = await getStore();
    const filename = argv._[2];
    const validPath = path.resolve(process.cwd(), filename).substring(rootDir.length)
    const json = await queryRemoteFile(validPath)
    success(`Fetch ${validPath} success: \r\n`)
    info(json, true)
    resolve()
  } catch(e){
    reject(e)
  }
})
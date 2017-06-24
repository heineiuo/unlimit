import {argv} from 'yargs'
import path from 'path'
import fs from 'fs-promise'
import getStore from '../store'
import Fetch from '../fetch-tools'
import {success} from '../show'

export default () => new Promise(async (resolve, reject) => {
  try {
    const {globalConfig: {API, token}, driveId, name, rootDir} = await getStore();
    const filename = argv._[1];
    const realPath = path.resolve(process.cwd(), filename);
    const validPath = realPath.substring(rootDir.length)

    const json = await Fetch(`${API}/seashell/fs/queryOneByFullPath`, {
      token, fullPath: `/${driveId}${validPath}`
    }).post()
    if (json.error) return reject(new Error(json.error))
    const {fileId, type} = json;
    if (type !== 1) return console.log('is not a file')

    const json2 = await Fetch(`${API}/seashell/fs/queryFileContent`, {
      token, fileId
    }).post()
    if (json2.error) return reject(new Error(json.error))
    await fs.writeFile(realPath, json2.cat)

    success(`Pull ${validPath} success`)

    resolve()
  } catch(e){
    reject(e)
  }
})
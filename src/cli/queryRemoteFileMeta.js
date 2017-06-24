import getConfig from './store'
import Fetch from './fetch-tools'

export default (validPath) => new Promise(async (resolve, reject) => {
  try {
    const {globalConfig: {API, token}, driveId, name, rootDir} = await getConfig();

    const json = await Fetch(`${API}/seashell/fs/queryOneByFullPath`, {
      token, fullPath: `/${driveId}${validPath}`
    }).post()
    if (json.error) return reject(new Error(json.error))
    resolve(json)
  } catch(e){
    reject(e)
  }
})
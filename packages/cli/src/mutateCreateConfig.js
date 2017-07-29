import fs from 'fs-promise'
import {homedir} from 'os'

export default () => new Promise(async (resolve, reject) => {
  try {
    const initialData = {
      token: null,
      API: 'http://local.youkuohao.com/api'
    }
    await fs.writeFile(`${homedir()}/.driveconfig`, JSON.stringify(initialData), 'utf8')
    resolve(initialData)
  } catch(e){
    reject(e)
  }
})
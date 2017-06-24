import queryGlobalConfig from '../queryGlobalConfig'
import {success, info} from '../show'

export default () => new Promise(async (resovle, reject) => {
  try {
    const config = await queryGlobalConfig()
    success(config, true)
  } catch(e){
    reject(e)
  }
})
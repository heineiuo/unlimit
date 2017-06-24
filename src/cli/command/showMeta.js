import getStore from '../store'
import {success, info, show} from '../show'

export default () => new Promise(async (resovle, reject) => {
  try {
    const store = await getStore()
    show(null, store, true)
  } catch(e){
    reject(e)
  }
})
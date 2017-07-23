import dispatch from './_dispatch'
import selfUpdate from '../server/actions/process/selfUpdate'

process.nextTick(async () => {
  
  try {
    const result = await dispatch(selfUpdate())

  } catch(e){
    reject(e)
  }
})

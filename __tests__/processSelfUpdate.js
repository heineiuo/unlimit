import selfUpdate from '../src/actions/process/selfUpdate'
import {createDispatch} from 'action-creator'


const dispatch = createDispatch({
  request: {},
  response: {}
})


process.nextTick(async () => {
  await dispatch(selfUpdate())
})


// test('process self update', async () => {
//   try {
//     await dispatch(selfUpdate())

//   } catch(e){
//     console.log(e)
//   }
// })

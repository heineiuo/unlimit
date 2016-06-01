import * as API from '../../../sdk/api'

const deleteFile =()=> {
  return async (dispatch, getState) => {
    try {

      const result = await API.deleteFile
      if (result.error) throw result.error


    } catch(e){
      console.error(e)
      alert()
    }
  }
}

export default deleteFile
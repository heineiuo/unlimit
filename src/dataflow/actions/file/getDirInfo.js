import * as API from '../../../sdk/api'

const getDirInfo = (path) => {
  return async (dispatch) => {
    try {
      path = decodeURI(path)

      const result = await API.readDir(path)
      result.parentPath = path + ( path =='/'?'':'/')

    } catch(e){
      console.error(e)
      alert()
    }
  }
}

export default  getDirInfo
import * as API from '../../sdk/api'

export default getDirInfo = (path) => {
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


export default uploadFileToPath = () => {
  return async (dispatch) => {
    try {

    // url: api['uploadImage'][2]+'?'+encodeQuery(formData),

    } catch(e){
      console.error(e)
      alert()
    }
  }
}

export default downloadFile =(path)=> {
  return async (dispatch) => {
    try {

      var url = API.getDownloadFileUrl(path)
      window.open(url)

    } catch(e){
      console.error(e)
      alert()
    }
  }
}

export default deleteFile =()=> {
  return async (dispatch) => {
    try {

      const result = await API.deleteFile
      if (result.error) throw result.error


    } catch(e){
      console.error(e)
      alert()
    }
  }
}

/**
 * 重命名文件
 * @returns {function()}
 */
export const renameFile = (path)=>{
  return async (dispatch, getState)=> {
    try {

      const result = await API.renameFile(path)
      if (result.error) throw result.error

    } catch(e){
      alert(e)
    }
  }
}
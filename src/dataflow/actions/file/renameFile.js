import * as API from '../../../sdk/api'

/**
 * 重命名文件
 * @returns {function()}
 */
const renameFile = (path)=>{
  return async (dispatch, getState)=> {
    try {

      const result = await API.renameFile(path)
      if (result.error) throw result.error

    } catch(e){
      alert(e)
    }
  }
}

export default renameFile
import * as API from '../../../sdk/api'


const downloadFile =(path)=> {
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

export default downloadFile
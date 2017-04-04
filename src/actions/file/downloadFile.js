import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const downloadFile = (path)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const url = POSTRawJSON(`${API_HOST}/seashell/fs/download`, {
      token, path});
    window.open(url)

  } catch(e){
    console.log(e);
  }
};

export default module.exports = downloadFile
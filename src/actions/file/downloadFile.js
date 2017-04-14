import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const downloadFile = (path)=> async (dispatch, getState) => {
  const {token} = getState().account;
  let result = null;
  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/fs/download`, {
      token, path});
  } catch(e){
    return console.log(e);
  }
  if (result.error) return console.log(result.error)
  window.open(result.url)
};

export default module.exports = downloadFile;
import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const downloadFile = (path)=> async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await POSTRawJSON(`${API_HOST}/seashell/fs/download`, {token, path});
  if (result.error) return console.log(result.error)
  window.open(result.url)
};

export default module.exports = downloadFile;
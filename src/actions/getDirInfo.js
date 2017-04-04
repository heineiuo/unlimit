import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../constants'


const getDirInfo = (path) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    path = decodeURI(path);
    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/ls`, {
      token, path});
    result.parentPath = path + ( path ==='/'?'':'/')

  } catch(e){
    console.log(e);
  }
};

export default module.exports = getDirInfo
import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'

/**
 * 重命名文件
 * @returns {function()}
 */
const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  const {token} = getState().account;
  let result = null;
  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/fs/mv`, {
      token, prevName, nextName
    });
  } catch(e){
    return console.log(e)
  }

  if (result.error) throw new Error(result.error);
};

export default module.exports = renameFile;
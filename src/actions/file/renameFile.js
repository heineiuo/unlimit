import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'

/**
 * 重命名文件
 * @returns {function()}
 */
const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/mv`, {
      token, prevName, nextName
    });
    if (result.error) throw new Error(result.error);

  } catch(e){
    console.log(e)
  }
};

export default module.exports = renameFile;
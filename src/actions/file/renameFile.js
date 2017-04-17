import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'

/**
 * 重命名文件
 * @returns {function()}
 */
const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await POSTRawJSON(`${API_HOST}/seashell/fs/mv`, {
    token, prevName, nextName
  });

  if (result.error) return console.log(result.error);
};

export default module.exports = renameFile;
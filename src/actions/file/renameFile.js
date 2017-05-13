import Fetch from 'fetch-tools'
import {API_HOST} from '../../constants'

/**
 * 重命名文件
 * @returns {function()}
 */
const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${API_HOST}/seashell/fs/mv`, {
    token, prevName, nextName
  }).post();

  if (result.error) return console.log(result.error);
};

export default module.exports = renameFile;

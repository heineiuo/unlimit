import Fetch from '@shared/fetch'
/**
 * 重命名文件
 * @returns {function()}
 */
export default (query) => async (dispatch, getState) => {
  const {account: {token}, file: {fileId}} = getState();
  const {fileName} = query;
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/mutateFileName`, {
    token,
    fileId,
    fileName
  }).post();

  if (result.error) console.log(result.error);
};

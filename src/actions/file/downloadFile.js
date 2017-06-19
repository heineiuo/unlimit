import Fetch from '@shared/fetch'
const {API_HOST} = global


const downloadFile = (path)=> async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${API_HOST}/seashell/fs/download`, {token, path}).post();
  if (result.error) return console.log(result.error)
  window.open(result.url)
};

export default module.exports = downloadFile;

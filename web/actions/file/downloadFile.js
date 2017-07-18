import Fetch from '@shared/fetch'


const downloadFile = (path)=> async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/download`, {token, path}).post();
  if (result.error) return console.log(result.error)
  window.open(result.url)
};

export default module.exports = downloadFile;

import Fetch from '@shared/fetch'
const {API_HOST} = global


const getDirInfo = (path) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    path = decodeURI(path);
    const result = await new Fetch(`${API_HOST}/seashell/fs/ls`, {token, path}).post();
    result.parentPath = path + ( path ==='/'?'':'/')

  } catch(e){
    console.log(e);
  }
};

export default module.exports = getDirInfo

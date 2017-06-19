import Fetch from '@shared/fetch'
const {API_HOST} = global

/**
 * 创建文件
 * @param query
 */
export default (query) => async (dispatch, getState) => {

  let createState = 1;
  const {driveId, name, parentId} = query;
  const {account: {token}} = getState();

  dispatch({
    type: '@@file/createState/update',
    payload: {
      createState
    }
  });
  let result = {}
  try {
    result = await new Fetch(`${API_HOST}/seashell/fs/mutateInsertOne`, {
      token,
      driveId,
      name,
      parentId,
      content: '',
    }).post();
    createState = 2;
  } catch(e){
    createState = 3;
    result.error = e
  }

  if (result.error) return console.log(result.error)

  dispatch({
    type: '@@file/createState/update',
    payload: {
      fileId: result._id,
      createState
    }
  })
};

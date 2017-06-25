import Fetch from '@shared/fetch'


const getFileList = (driveId, parentId=null) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/list/update',
    payload: {
      fileState: 1
    }
  });

  const {account: {token}} = getState();
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/queryFile`, {
    driveId, parentId, token,
    replaceWithFileMetaIfIsFile: true
  }).post();

  if (result.error) return console.log(result.error)
  dispatch({
    type: '@@file/list/update',
    payload: result.data ? {ls: result.data, isFile: false} : result
  })

};

export default getFileList;

import Fetch from '@shared/fetch'


const getFileList = (driveId, parentId=null) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/meta/update',
    payload: {
      fileState: 1
    }
  });

  const {account: {token}} = getState();
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/queryFile`, {
    driveId, parentId, token,
    replaceWithFileMetaIfIsFile: true
  }).post();

  const isFile = result.hasOwnProperty('data')
  if (isFile) result.ls = result.data
  result.fileName = result.name 
  result.isFile = result.isFile 

  if (result.error) return console.log(result.error)
  dispatch({
    type: '@@file/meta/update',
    payload: result
  })

};

export default getFileList;

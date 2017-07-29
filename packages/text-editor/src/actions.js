import Fetch from '@shared/fetch'

/**
 * 创建文件
 * @param query
 */
export const createFile = (query) => async (dispatch, getState) => {

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
    result = await new Fetch(`${global.__SMILE_API}/seashell/fs/mutateInsertOne`, {
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



export const getFileContent = (driveId) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/state/update',
    payload: {
      fileContentState: 1
    }
  });

  const {account: {token}, file: {fileId}} = getState();
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/queryFileContent`, {
    driveId,
    fileId,
    token
  }).post();

  if (result.error) return console.log(result.error)

  if (typeof result.cat === 'object' && result.cat.data instanceof Array) {
    result.cat = new Buffer(result.cat).toString('utf8')
  }

  dispatch({
    type: '@@file/content/update',
    payload: result
  })
};



/**
 * Converts an array buffer to a string
 *
 * @private
 * @param {ArrayBuffer} buf The buffer to convert
 * @param {Function} callback The function to call when conversion is complete
 */
function _arrayBufferToString(buf, callback) {
  var bb = new Blob([new Uint8Array(buf)]);
  var f = new FileReader();
  f.onload = function(e) {
    callback(e.target.result);
  };
  f.readAsText(bb);
}



export const updateFile = (query) => async (dispatch, getState) => {
  const {account: {token}, file: {fileId}} = getState();
  const {driveId, content} = query;
  let result = {};
  try {
    result = await new Fetch(`${global.__SMILE_API}/seashell/fs/mutateFileContent`, {
      token,
      driveId,
      fileId,
      content,
    }).post();
  } catch(e){
    result.error = e;
  }
  if (result.error) return console.error(result.error);
  dispatch({
    type: '@@file/content/update',
    payload: {cat: content}
  })
};


export const initFile = (payload) => ({
  type: '@@file/init',
  payload
});


export const updateFileMeta = (payload) => ({
  type: '@@file/state/update',
  payload
});


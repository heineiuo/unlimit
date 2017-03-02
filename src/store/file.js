import { handleActions } from 'redux-actions'
import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {ORIGIN_HOST} from '../constants'

const initialState = {
  ls: [],
  isFile: false,
  // isDirectory: true,
  cat: '',
  fileState: 0,
};

export default handleActions({

  FILE_STATE_UPDATE (state, action) {
    return Object.assign({}, state, action.payload)
  },

  FILE_LIST_UPDATE (state, action) {
    return Object.assign({}, state, action.payload, {fileState: 2})
  }

}, initialState)

/**
 * 重命名文件
 * @returns {function()}
 */
export const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      importAppName: 'gateway',
      reducerName: 'file', action: 'mv',
      token, prevName, nextName
    });
    if (result.error) throw new Error(result.error);

  } catch(e){
    console.log(e)
  }
};

export const uploadFileToPath = () => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    // url: api['uploadImage'][2]+'?'+encodeQuery(formData),

  } catch(e){
    console.log(e);
  }
};



export const deleteFile = (filename) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      importAppName: 'gateway',
      reducerName: 'file',
      action: 'del',
      token,
      filename
    });
    if (result.error) throw result.error

  } catch(e){
    console.log(e);
    console.log()
  }
};

export const downloadFile = (path)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const url = POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      importAppName: 'gateway',
      reducerName: 'file', action: 'download',
      token, path});
    window.open(url)

  } catch(e){
    console.log(e);
    console.log()
  }
};

export const getDirInfo = (path) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    path = decodeURI(path);
    const result = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      importAppName: 'gateway',
      reducerName: 'file', action: 'ls',
      token, path});
    result.parentPath = path + ( path =='/'?'':'/')

  } catch(e){
    console.log(e);
  }
};

export const getFileList = (pathname='/') => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'FILE_STATE_UPDATE',
      payload: {
        fileState: 1
      }
    });

    const {hostname} = getState().host;
    const {token} = getState().account;
    const result = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      importAppName: 'gateway',
      reducerName: 'file', action: 'ls',
      hostname, pathname, token
    });

    if (result.error) throw new Error(result.error);

    dispatch({
      type: 'FILE_LIST_UPDATE',
      payload: result
    })

  } catch(e){
    console.log(e.stack)
  }
};

export const restoreFileList = () => ({
  type: 'FILE_STATE_UPDATE',
  payload: {fileState: 0}
});
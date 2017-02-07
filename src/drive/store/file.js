import { handleActions } from 'redux-actions'
import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../constants'

const initialState = {
  ls: []
};

export default handleActions({

  FILE_LIST_UPDATE (state, action) {
    return Object.assign({}, state, {
      ls: action.ls
    })
  }

}, initialState)

/**
 * 重命名文件
 * @returns {function()}
 */
export const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${API_HOST}/api/gateway`, {
      reducerName: 'file', action: 'mv',
      token, prevName, nextName
    });
    if (result.error) throw result.error

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

    const result = await POSTRawJSON(`${API_HOST}/api/gateway`, {
      reducerName: 'file', action: 'del',
      token, filename
    });
    if (result.error) throw result.error

  } catch(e){
    console.log(e);
    console.log()
  }
};

export const downloadFile = (path)=> async (dispatch) => {
  try {
    const {token} = getState().account;

    const url = POSTRawJSON(`${API_HOST}/api/gateway`, {
      reducerName: 'file', action: 'download',
      token, path});
    window.open(url)

  } catch(e){
    console.log(e);
    console.log()
  }
};

export const getDirInfo = (path) => async (dispatch) => {
  try {
    const {token} = getState().account;

    path = decodeURI(path);
    const result = await POSTRawJSON(`${API_HOST}/api/gateway`, {
      reducerName: 'file', action: 'ls',
      token, path});
    result.parentPath = path + ( path =='/'?'':'/')

  } catch(e){
    console.log(e);
    console.log()
  }
};

export const getFileList = (hostname, pathname='/') => async (dispatch, getState) => {
  try {
    console.log(hostname, pathname);
    dispatch({
      type: 'FILE_LIST_UPDATE',
      ls: []
    });

    const {token} = getState().account;
    const result = await POSTRawJSON(`${API_HOST}/api/gateway`, {
      reducerName: 'file', action: 'ls',
      hostname, pathname, token
    });

    if (result.error) throw result.error;

    dispatch({
      type: 'FILE_LIST_UPDATE',
      ls: result.ls
    })

  } catch(e){
    console.log(e.stack||e)
  }
};
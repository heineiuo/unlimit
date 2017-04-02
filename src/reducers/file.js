import { handleActions } from 'redux-actions'
import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../constants'

const initialState = {
  ls: [],
  isFile: false,
  // isDirectory: true,
  cat: '',
  fileState: 0,
  clipboard: []
};

export default handleActions({

  FILE_STATE_UPDATE (state, action) {
    return Object.assign({}, state, action.payload)
  },

  FILE_LIST_UPDATE (state, action) {
    return Object.assign({}, state, action.payload, {fileState: 2})
  },
  FILE_CLIPBOARD_UPDATE (state, action) {
    return Object.assign({}, state, {clipboard: action.payload.clipboard})
  },

  FILE_CLIPBOARD_EMPTY (state, action) {
    return Object.assign({}, state, {clipboard: []})
  }

}, initialState)

export const reducerName = 'file';

/**
 * 重命名文件
 * @returns {function()}
 */
export const renameFile = (prevName, nextName)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/mv`, {
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



export const deleteFile = (driveId, pathname) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/unlink`, {
      action: 'unlink',
      token,
      driveId,
      pathname
    });
    if (result.error) throw result.error

  } catch(e){
    console.log(e);
  }
};

export const downloadFile = (path)=> async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const url = POSTRawJSON(`${API_HOST}/seashell/fs/download`, {
      token, path});
    window.open(url)

  } catch(e){
    console.log(e);
  }
};

export const getDirInfo = (path) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    path = decodeURI(path);
    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/ls`, {
      token, path});
    result.parentPath = path + ( path =='/'?'':'/')

  } catch(e){
    console.log(e);
  }
};

export const getFileList = (driveId, pathname='/') => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'FILE_STATE_UPDATE',
      payload: {
        fileState: 1
      }
    });

    const {token} = getState().account;
    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/ls`, {
      driveId, pathname, token
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

/**
 * 将文件添加到剪贴板
 */
export const pushFileToClipboard = (files) => (dispatch, getState) => {
  const {clipboard} = getState().file;
  const nextClipboard = clipboard.slice().filter(item => {
    return files.indexOf(item) === -1
  }).concat(files);
  dispatch({
    type: 'FILE_CLIPBOARD_UPDATE',
    payload: {
      clipboard: nextClipboard
    }
  })
};

/**
 * 清空剪贴板
 */
export const emptyClipboard = () => ({
  type: 'FILE_CLIPBOARD_EMPTY',
});

/**
 * 将剪贴板里的文件拷贝到当前目录
 * @param targetPathname 目标目录
 * @param keepOrigin true保留文件，false删除源文件
 */
export const copyFilesFromClipboard = (targetPathname, keepOrigin=true) => (dispatch, getState) => {

};
import { handleActions } from 'redux-actions'
import Fetch from '@shared/fetch'
import { injectAsyncReducer } from '@react-web/store'


const initialState = {
  ls: [],
  isFile: false,
  // isDirectory: true,
  cat: '',
  fileId: null,
  createState: 0, // 0未创建，1正在创建，2已创建，3创建出错
  fileState: 0,
  fileName: '',
  fileContentState: 0,
  clipboard: []
};

injectAsyncReducer('file', handleActions({

  "@@file/state/update" (state, action) {
    return Object.assign({}, state, action.payload)
  },

  "@@file/meta/update" (state, action) {
    return Object.assign({}, state, action.payload, {fileState: 2})
  },

    "@@file/content/update" (state, action) {
    return Object.assign({}, state, action.payload, {
      fileContentState: 2,
      createState: 2
    })
  },

  "@@file/clipboard/update" (state, action) {
    return Object.assign({}, state, {clipboard: action.payload.clipboard})
  },

  '@@file/clipboard/empty' (state, action) {
    return Object.assign({}, state, {clipboard: []})
  },

  // 更新创建文件的状态，并且，
  // 如果创建成功，文件状态也变成同步成功
  // 如果创建失败，文件状态为未同步
  '@@file/createState/update' (state, action) {
    const {createState, fileId} = action.payload;
    return Object.assign({}, state, {
      fileId: fileId ? fileId: undefined,
      fileState: createState === 2?2:0,
      createState
    })
  }

}, initialState))



export const copyFilesFromClipboard = require('./actions/copyFilesFromClipboard')
export const createFile = require('./actions/createFile')
export const deleteFile = require('./actions/deleteFile')
export const downloadFile = require('./actions/downloadFile')
export const emptyClipboard = require('./actions/emptyClipboard')
export const getFileContent = require('./actions/getFileContent')

export const getFileList =  (driveId, parentId=null) => async (dispatch, getState) => {
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


export const initFile = require('./actions/initFile')
export const pushFileToClipboard = require('./actions/pushFileToClipboard')
export const renameFile = require('./actions/renameFile')
export const resotreFileList = require('./actions/restoreFileList')
export const updateFile = require('./actions/updateFile')
export const updateFileMeta = require('./actions/updateFileMeta')
export const uploadFiltToPath = require('./actions/uploadFileToPath')


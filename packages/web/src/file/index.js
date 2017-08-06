import { match, when } from 'match-when'
import { injectAsyncReducer } from '@react-web/store'
import api from '../api'

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
}

const reducer = (state=initialState, action) => match(action.type, {

  [when("@@file/state/update")]: () => {
    return Object.assign({}, state, action.payload)
  },

  [when("@@file/meta/update")]: () => {
    return Object.assign({}, state, action.payload, {fileState: 2})
  },

  [when("@@file/content/update")]:  () => {
    return Object.assign({}, state, action.payload, {
      fileContentState: 2,
      createState: 2
    })
  },

  [when("@@file/clipboard/update")]: () => {
    return Object.assign({}, state, {clipboard: action.payload.clipboard})
  },

  [when('@@file/clipboard/empty')]: () => {
    return Object.assign({}, state, {clipboard: []})
  },

  // 更新创建文件的状态，并且，
  // 如果创建成功，文件状态也变成同步成功
  // 如果创建失败，文件状态为未同步
  [when('@@file/createState/update')]: () => {
    const {createState, fileId} = action.payload
    return Object.assign({}, state, {
      fileId: fileId ? fileId: undefined,
      fileState: createState === 2?2:0,
      createState
    })
  },
  [when()]: state
})


injectAsyncReducer('file', reducer)


/**
 * 将剪贴板里的文件拷贝到当前目录
 * @param targetPathname 目标目录
 * @param keepOrigin true保留文件，false删除源文件
 */
export const copyFilesFromClipboard = (targetPathname, keepOrigin=true) => (dispatch, getState) => {

}




/**
 * 创建文件
 * @param query
 */
export const createFile = (query) => async (dispatch, getState) => {

  let createState = 1
  const {driveId, name, parentId} = query
  const {account: {token}} = getState()

  dispatch({
    type: '@@file/createState/update',
    payload: {
      createState
    }
  })
  const result = await api.fsInsertOne({
    token,
    driveId,
    name,
    parentId,
    content: '',
  })
  createState = 2


  if (result.error) return console.log(result.error)

  dispatch({
    type: '@@file/createState/update',
    payload: {
      fileId: result._id,
      createState
    }
  })
}




export const deleteFile = (driveId, fileId) => async (dispatch, getState) => {
  const {token} = getState().account
  const result = await api.fsRemoveOne({
    token,
    driveId,
    fileId
  }).post()
  if (result.error) return console.log(result.error)
}



export const getFileList =  (driveId, parentId=null) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/meta/update',
    payload: {
      fileState: 1
    }
  })

  const {account: {token}} = getState()
  const result = await api.fsList({
    driveId, parentId, token,
    replaceWithFileMetaIfIsFile: true
  })

  const isFile = result.hasOwnProperty('data')
  if (isFile) result.ls = result.data
  result.fileName = result.name 
  result.isFile = result.isFile 

  if (result.error) return console.log(result.error)
  dispatch({
    type: '@@file/meta/update',
    payload: result
  })

}


export const downloadFile = (path)=> async (dispatch, getState) => {
  const {token} = getState().account
  const result = await api.fsDownload({token, path})
  if (result.error) return console.log(result.error)
  window.open(result.url)
}


export const initFile = (payload) => ({
  type: '@@file/init',
  payload
})


/**
 * 清空剪贴板
 */
export const emptyClipboard = () => ({
  type: '@@file/clipboard/empty',
})


export const getFileContent = (driveId) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/state/update',
    payload: {
      fileContentState: 1
    }
  })

  const {account: {token}, file: {fileId}} = getState()
  const result = await api.fsQueryContent({
    driveId,
    fileId,
    token
  })

  if (result.error) return console.log(result.error)

  if (typeof result.cat === 'object' && result.cat.data instanceof Array) {
    result.cat = new Buffer(result.cat).toString('utf8')
  }

  dispatch({
    type: '@@file/content/update',
    payload: result
  })
}


/**
 * 将文件添加到剪贴板
 */
export const pushFileToClipboard = (files) => (dispatch, getState) => {
  const {clipboard} = getState().file
  const nextClipboard = clipboard.slice().filter(item => {
    return files.indexOf(item) === -1
  }).concat(files)
  dispatch({
    type: '@@file/clipboard/update',
    payload: {
      clipboard: nextClipboard
    }
  })
}

/**
 * 重命名文件
 * @returns {function()}
 */
export const renameFile = (query) => async (dispatch, getState) => {
  const {account: {token}, file: {fileId}} = getState()
  const {fileName} = query
  const result = await api.fsMutateName({
    token,
    fileId,
    fileName
  })

  if (result.error) console.log(result.error)
}


export const resotreFileList = () => ({
  type: '@@file/state/update',
  payload: {fileState: 0}
})


export const updateFile = (query) => async (dispatch, getState) => {
  const {account: {token}, file: {fileId}} = getState()
  const {driveId, content} = query
  const result = await api.fsMutateContent({
    token,
    driveId,
    fileId,
    content,
  })
  if (result.error) return console.error(result.error)
  dispatch({
    type: '@@file/content/update',
    payload: {cat: content}
  })
}


export const updateFileMeta = (payload) => ({
  type: '@@file/state/update',
  payload
})


export const uploadFileToPath = () => async (dispatch, getState) => {
  try {
    const {token} = getState().account

    // url: api['uploadImage'][2]+'?'+encodeQuery(formData),

  } catch(e){
    console.log(e)
  }
}




/**
 * Converts an array buffer to a string
 *
 * @private
 * @param {ArrayBuffer} buf The buffer to convert
 * @param {Function} callback The function to call when conversion is complete
 */
function _arrayBufferToString(buf, callback) {
  var bb = new Blob([new Uint8Array(buf)])
  var f = new FileReader()
  f.onload = function(e) {
    callback(e.target.result)
  }
  f.readAsText(bb)
}

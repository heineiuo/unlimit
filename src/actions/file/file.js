import { handleActions } from 'redux-actions'

const initialState = {
  ls: [],
  isFile: false,
  // isDirectory: true,
  cat: '',
  fileId: null,
  createState: 0, // 0未创建，1正在创建，2已创建，3创建出错
  fileState: 0,
  clipboard: []
};

export default handleActions({

  "@@file/state/update" (state, action) {
    return Object.assign({}, state, action.payload)
  },

  "@@file/list/update" (state, action) {
    return Object.assign({}, state, action.payload, {fileState: 2})
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

}, initialState)


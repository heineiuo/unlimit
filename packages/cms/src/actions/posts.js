import { handleActions } from 'redux-actions'

const initialState = {
  ls: [],
  isFile: false,
  // isDirectory: true,
  cat: '',
  currentState: 0, // 0未同步，1正在同步，2已同步，3同步中断/错误
  current: {
    title: '',
    content: '',
    topicId: '',
    tags: '',
    html: '',
  },
  fileState: 0, // 0未同步，1正在同步，2已同步，3同步出错
  createState: 0, // 0未创建，1正在创建，2已创建，3创建出错

  listUpdateState: 0, // 0未同步，1，正在同步，2已同步，3同步出错
  afterId: null,
  list: [],

  // 这个driveId的标签云
  tags: [],
  tagsUpdateState: 0  // 0未同步，1正在同步，2已同步，3同步出错
};

export default handleActions({

  topic__stateUpdate (state, action) {
    return Object.assign({}, state, action.payload)
  },
  topic__init (state, action) {
    return Object.assign({}, initialState)
  },

  topic__listUpdate (state, action) {
    return Object.assign({}, state, action.payload)
  },

  topic__tagsUpdate (state, action) {
    return Object.assign({}, state, action.payload)
  },

  // 更新创建文件的状态，并且，
  // 如果创建成功，文件状态也变成同步成功
  // 如果创建失败，文件状态为未同步
  topic__postStateUpdate (state, action) {
    const {createState} = action.payload;
    return Object.assign({}, state, {
      fileState: createState === 2?2:0,
      createState
    })
  },

  // 更新当前文件
  topic__currentStateUpdate (state, action) {
    return Object.assign({}, state, {
      currentState: action.payload.currentState
    })
  },
  topic__currentTopicUpdate (state, action) {
    const nextCurrent = Object.assign({tags: ''}, action.payload);
    return Object.assign({}, state, {current: nextCurrent, currentState: 2});
  }

}, initialState)

export const emptyTopicState = () => ({
  type: 'topic__init'
});
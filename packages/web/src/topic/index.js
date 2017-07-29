import { handleActions } from 'redux-actions'
import Fetch from '@shared/fetch'
const {API_HOST} = global
import {push} from 'react-router-redux'
import {stateToHTML} from 'draft-js-export-html'
import {convertToRaw} from 'draft-js'
import {injectAsyncReducer} from '@react-web/store'

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


injectAsyncReducer('topic', handleActions({

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

}, initialState))



export const allStatus = ['草稿', '已发布', '已下线'] 
export const methodTypes = ['getMore', 'getLatest']


export const emptyTopicState = () => ({
  type: 'topic__init'
});

export const editTopicStatus = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  let result = null

  const {account: {token}} = getState();
  const {status, topicId} = query;
  try {
    result = await new Fetch(`${API_HOST}/seashell/topic/editStatus`, {
      status, token, topicId
    }).post();
    if (result.error) {
      return reject(result.error)
    }
  } catch(e){
    return reject(e)
  }

  resolve()
})




export const editTopicTags = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  let result = null
  const {account: {token}} = getState();
  const {tags, topicId} = query;
  try {
    result = await new Fetch(`${API_HOST}/seashell/topic/editTags`, {
      tags, token, topicId
    }).post();
    if (result.error) {
      return reject(result.error)
    }
  } catch(e){
    return reject(e)
  }

  resolve()
})



export const getDriveTopicTags = (driveId) => async (dispatch, getStore) => {
  dispatch({
    type: "topic__tagsUpdate",
    payload: {
      tagsUpdateState: 1
    }
  })

  const handleError = (e) => process.nextTick(() => {
    console.log(e);
    dispatch({
      type: "topic__tagsUpdate",
      payload: {
        tagsUpdateState: 3
      }
    })
  })

  const { account: {token}} = getStore();
  let result = null;
  try {
    result = await new Fetch(`${API_HOST}/seashell/tags/getDriveTags`, {
      token,
      driveId,
    }).post();
    if (result.error) return handleError(result.error)
  } catch (e) {
    return handleError(e)
  }

  dispatch({
    type: "topic__tagsUpdate",
    payload: {
      tagsUpdateState: 2,
      tags: result.list
    }
  })
}




export const getTopic = (driveId, topicId) => async (dispatch,getState) => {

  
  const handleError = (e) => process.nextTick(() => {
    console.log(e);
    dispatch({
      type: "topic__currentStateUpdate",
      payload: {
        currentState: 3
      }
    })
  })

  const { account: {token}, topic: {current}} = getState();

  dispatch({
    type: "topic__currentStateUpdate",
    payload: {currentState: 1}
  })

  let result = null;
  try {
    result = await new Fetch(`${API_HOST}/seashell/topic/get`, {
      token,
      driveId,
      topicId: topicId
    }).post();
    if (result.error) return handleError(result.error)
  } catch(e){
    return handleError(e)
  }

  dispatch({
    type: "topic__currentTopicUpdate",
    payload: result
  })


}







/**
 * 获取话题列表
 * @param {*} driveId 
 * @param {*} customOptions 
 */
export const getTopicList = (driveId, customOptions) => async (dispatch, getStore) => {

  const defaultOptions = {
    sort: {
      time: 1
    },
    keyword: '', //a,b,c
    afterId: null,
  }

  dispatch({
    type: "topic__listUpdate",
    payload: {
      listUpdateState: 1
    }
  })

  const options = Object.assign({}, defaultOptions, customOptions)

  const handleError = (e) => process.nextTick(() => {
    console.log(e);
    dispatch({
      type: "topic__listUpdate",
      payload: {
        listUpdateState: 3
      }
    })
  })

  const {topic: {list}, account: {token}} = getStore();
  let result = null;
  try {
    result = await new Fetch(`${API_HOST}/seashell/topic/list`, {
      token,
      driveId,
      keyword: options.keyword,
      fields: ['title', 'tags', 'status'],
      afterId: options.afterId,
    }).post();
    if (result.error) return handleError(result.error)
  } catch (e) {
    return handleError(e)
  }

  dispatch({
    type: "topic__listUpdate",
    payload: {
      listUpdateState: 2,
      list: options.afterId ? list.concat(result.list) : result.list
    }
  })
}




/**
 * 创建话题
 * @param {*} query 
 */
export const postTopic = (query) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const {title, editorState, driveId} = query;
  const contentState = editorState.getCurrentContent();
  const html = stateToHTML(contentState);
  const content = convertToRaw(contentState);

  const result = await new Fetch(`${API_HOST}/seashell/topic/create`, {
    token,
    driveId,
    title,
    content,
    html
  }).post();
  if (result.error) return console.log(result.error)

  dispatch({
    type: 'topic__currentTopicUpdate',
    payload: {
      title,
      content,
      html,
      syncState: 2
    }
  })
  dispatch(push(`/drive/${driveId}/topics/${result.topicId}`))
}



/**
 * 更新话题
 * @param {*} query 
 */
export const putTopic = (query) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const {title, editorState, tags, topicId} = query;
  const contentState = editorState.getCurrentContent();
  const html = stateToHTML(contentState);
  const content = convertToRaw(contentState);

  const result = await new Fetch(`${API_HOST}/seashell/topic/edit`, {
    token,
    title,
    topicId,
    content,
    html
  }).post();
  if (result.error) return console.log(result.error)

  dispatch({
    type: 'topic__currentTopicUpdate',
    payload: {
      title,
      content,
      html,
      tags,
      syncState: 2
    }
  })
}


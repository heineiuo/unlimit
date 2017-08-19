import { match, when } from 'match-when'
import { push } from 'react-router-redux'
import { stateToHTML } from 'draft-js-export-html'
import { convertToRaw } from 'draft-js'
import { injectAsyncReducer } from '@react-web/store'
import api from '../api'

const defaultState = {
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
}



const reducer = (state=defaultState, action) => match(action.type, {
  [when('@@topic/STATE_CHANGE')]: () => Object.assign({}, state, action.payload),
  [when('@@topic/TAGS_CHANGE')]: () => Object.assign({}, state, action.payload),
  [when('@@topic/INIT')]: () => Object.assign({}, defaultState),
  [when('@@topic/LIST_UPDATE')]: () => Object.assign({}, state, action.payload),


  // 更新创建文件的状态，并且，
  // 如果创建成功，文件状态也变成同步成功
  // 如果创建失败，文件状态为未同步
  [when('@@topic/POST_STATE_CHANGE')]: () => {
    const {createState} = action.payload
    return Object.assign({}, state, {
      fileState: createState === 2?2:0,
      createState
    })
  },

  // 更新当前文件
  [when('@@topic/CURRENT_STATE_CHANGE')]: () => {
    return Object.assign({}, state, {
      currentState: action.payload.currentState
    })
  },

  [when('@@topic/CURRENT_TOPIC_UPDATE')]: () => {
    const nextCurrent = Object.assign({tags: ''}, action.payload)
    return Object.assign({}, state, {current: nextCurrent, currentState: 2})
  },

  [when()]: state
})

injectAsyncReducer('topic', reducer)

export const allStatus = ['草稿', '已发布', '已下线'] 
export const methodTypes = ['getMore', 'getLatest']

export const emptyTopicState = () => ({
  type: '@@topic/INIT'
})

export const editTopicStatus = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const {account: {token}} = getState()
  const {status, topicId} = query
  const result = await api.topicStatusChange({status, token, topicId})
  if (result.error) return reject(result.error)
  resolve()
})

export const editTopicTags = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const {account: {token}} = getState()
  const {tags, topicId} = query
  const result = await api.topicTagChange({tags, token, topicId})
  if (result.error) return reject(result.error)
  resolve()
})



export const getDriveTopicTags = (driveId) => async (dispatch, getStore) => {
  dispatch({
    type: "@@topic/TAGS_CHANGE",
    payload: {
      tagsUpdateState: 1
    }
  })

  const handleError = (e) => process.nextTick(() => {
    console.log(e)
    dispatch({
      type: "@@topic/TAGS_CHANGE",
      payload: {
        tagsUpdateState: 3
      }
    })
  })

  const { account: {token}} = getStore()
  const result = await api.driveTags({
    token,
    driveId,
  })
  if (result.error) return handleError(result.error)

  dispatch({
    type: "@@topic/TAGS_CHANGE",
    payload: {
      tagsUpdateState: 2,
      tags: result.list
    }
  })
}


export const getTopic = (driveId, topicId) => async (dispatch,getState) => {
  const { account: {token}, topic: {current}} = getState()

  dispatch({
    type: "@@topic/CURRENT_STATE_CHANGE",
    payload: {currentState: 1}
  })

  const result = await api.topicGet({
    token,
    driveId,
    topicId: topicId
  })
  if (result.error) {
    return dispatch({
      type: "@@topic/CURRENT_STATE_CHANGE",
      payload: {
        currentState: 3
      }
    })
  }

  dispatch({
    type: "@@topic/CURRENT_TOPIC_UPDATE",
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
    type: "@@topic/LIST_UPDATE",
    payload: {
      listUpdateState: 1
    }
  })

  const options = Object.assign({}, defaultOptions, customOptions)

  const handleError = (e) => process.nextTick(() => {
    console.log(e)
    dispatch({
      type: "@@topic/LIST_UPDATE",
      payload: {
        listUpdateState: 3
      }
    })
  })

  const {topic: {list}, account: {token}} = getStore()

  const result = await api.topicList({
    token,
    driveId,
    keyword: options.keyword,
    fields: ['title', 'tags', 'status'],
    afterId: options.afterId,
  })
  if (result.error) return handleError(result.error)

  dispatch({
    type: "@@topic/LIST_UPDATE",
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

  const {account: {token}} = getState()
  const {title, editorState, driveId} = query
  const contentState = editorState.getCurrentContent()
  const html = stateToHTML(contentState)
  const content = convertToRaw(contentState)

  
  const result = await api.topicCreate({
    token,
    driveId,
    title,
    content,
    html
  })
  if (result.error) return console.log(result.error)

  dispatch({
    type: '@@topic/CURRENT_TOPIC_UPDATE',
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

  const {account: {token}} = getState()
  const {title, editorState, tags, topicId} = query
  const contentState = editorState.getCurrentContent()
  const html = stateToHTML(contentState)
  const content = convertToRaw(contentState)

  const result = await api.topicEdit({
    token,
    title,
    topicId,
    content,
    html
  })
  if (result.error) return console.log(result.error)

  dispatch({
    type: '@@topic/CURRENT_TOPIC_UPDATE',
    payload: {
      title,
      content,
      html,
      tags,
      syncState: 2
    }
  })
}


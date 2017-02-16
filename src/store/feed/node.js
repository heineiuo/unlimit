/**
 * 当前正在编辑或浏览的节点
 */

import { handleActions } from 'redux-actions'

const initialState = {
  syncTaskStatus: 0, // 0未开始, 1开始, 任务已同步, 2 开始, 任务同步中, 3 开始, 失败了
  syncTaskTime: Date.now(),
  // 正在编辑或浏览的节点, 如果为'',则表示未选中任何节点
  id: '',
  // 节点的关系列表
  relationship: {},
  // 节点的属性
  data: {},
  linkList: []
};

export default handleActions({

  /**
   * 初始化, 节点重置
   */
  NODE_INIT (state, action) {
    return Object.assign({}, initialState)
  },

  /**
   * 更新节点
   */
  NODE_UPDATE (state, action) {
    return Object.assign({}, state, {
      id: action.id,
      data: action.data
    })
  },

  /**
   * 开启同步任务
   */
  NODE_SYNC_TASK_STARTED (state, action) {
    return Object.assign({}, state, {
      syncTaskStatus: 1,
    })
  },

  NODE_SYNC_ERROR (state, action) {
    return Object.assign({}, state, {
      syncTaskStatus: 3
    })
  },
  NODE_SYNC_FINISH (state, action) {
    return Object.assign({}, state, {
      syncTaskStatus: 1,
      syncTaskTime: Date.now()
    })
  },

  NODE_SYNCING (state, action) {
    return Object.assign({}, state, {
      syncTaskStatus: 2
    })
  },

  NODE_LINK_LIST_UPDATE (state, action) {
    return Object.assign({}, state, {
      linkList: action.linkList
    })
  }

}, initialState)

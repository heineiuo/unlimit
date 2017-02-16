// dataflow/reducers/article.js

/**
 * 当前正在编辑的文章
 */

import { handleActions } from 'redux-actions'

const initialState = {
  // 资源id
  resourceId: '',
  // 标题
  title: '',
  // 正文 格式可能是`html`, 也可能是map,
  // 使用map的原因是考虑到多人协作, 需要对log精细到字
  // 那数据结构可能是: {小标题1: {字1}, 段落1: {字1}, 段落2...}
  content: '',
  // 面包屑导航
  breadcrumbs: []
};

export default handleActions({

  /**
   * 初始化
   */
  ARTICLE_INIT (state, action) {
    return Object.assign({}, initialState)
  },

  /**
   * 更新整个文章
   */
  ARTICLE_UPDATE (state, action) {
    return {
      resourceId: action.resourceId,
      title: action.title,
      content: action.content,
    }
  },

  /**
   * 更新标题
   */
  ARTICLE_TITLE_UPDATE (state, action) {
    return Object.assign({}, state, {
      title: action.title
    })
  },

  /**
   * 更新正文
   */
  ARTICLE_CONTENT_UPDATE (state, action) {
    return Object.assign({}, state, {
      content: action.content
    })
  }

}, initialState)

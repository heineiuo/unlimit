import { handleActions } from 'redux-actions'

const initialState = {
  // 出版目录
  bookIndex: {}
};

export default handleActions({

  /**
   * 初始化
   */
  BOOK_INIT (state, action) {
    return Object.assign({}, initialState)
  },

  BOOK_LIST_UPDATE (state, action) {
    return Object.assign({}, state, {
      list: action.list
    })
  }

}, initialState)

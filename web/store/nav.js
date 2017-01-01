import { handleActions } from 'redux-actions'

const initialState = {
  navMap: {
    id0: {
      name: '控制台',
      param: '/'
    },
    id1: {
      name: '代理设置',
      param: 'gateway',
      prevId: 'id0'
    },
    id2: {
      name: '域名',
      param: 'host',
      prevId: 'id0'
    },
    id3: {
      name: '监控',
      param: 'monitor',
      prevId: 'id0'
    },
    id4: {
      name: '远程终端',
      param: 'terminal',
      prevId: 'id0'
    }
  },
  rootId: 'id0',
  currentId: 'id1'
}

export default module.exports = handleActions({

  NAV_CHANGE (state, action) {
    return Object.assign({}, state, {
      currentId: action.next
    })
  }

}, initialState)

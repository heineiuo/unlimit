import { handleActions } from 'redux-actions'
import { POSTUrlencodeJSON } from '../utils/fetch-tools'
import { API_HOST } from '../utils/config'

const initialState = {
  list: [],

  groupList: [],
  // 申请好友状态缓存，FRIEND_APPLY_STATUS_UPDATE
  // 有新的申请时记录进来，标记为服务器请求中，服务器返回结果后更新状态，
  // 用户点击「完成」操作后清除记录
  friendApplyMap: {},
  deleteFriendState: 0,// 删除好友操作的状态 0 无操作 1 正在删除 2 删除成功 3 删除失败
};

export default handleActions({

  FRIEND_LIST_UPDATE (state, action) {
    const {payload} = action;
    return Object.assign({}, state, {
      list: payload.list
    })
  },

  FRIEND_APPLY_STATUS_UPDATE (state, action) {
    const {uid, status, msg=''} = action.payload;
    const {friendApplyMap} = state;
    let nextFriendApplyMap = Object.assign({}, friendApplyMap);
    if (friendApplyMap.hasOwnProperty(uid)) {
      if (status == 'USER_ACTION_CLEAR') {
        delete nextFriendApplyMap[uid];
      } else {
        nextFriendApplyMap[uid].status = status;
        nextFriendApplyMap[uid].msg = msg;
      }
    } else {
      nextFriendApplyMap[uid] = {status, msg};
    }

    return Object.assign({}, state, {friendApplyMap: nextFriendApplyMap})
  },

  FRIEND_GROUP_LIST_UPDATE (state, action) {
    return Object.assign({}, state, {groupList: action.payload.groupList})
  },

  FRIEND_DELETE (state, action) {
    const list = state.list.slice().filter(item =>item.pals_id != action.payload.uid);
    return Object.assign({}, state, {list})
  },

  FRIEND_DELETE_FRIEND_STATUS_UPDATE (state, action) {
    return Object.assign({}, state, {deleteFriendState: action.payload.state})
  },


}, initialState)

/**
 * 发送添加好友的请求
 * @param uid
 * @param gid
 * @param remark
 */
export const applyFriend = (uid, gid, remark) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;
    dispatch({
      type: 'FRIEND_APPLY_STATUS_UPDATE',
      payload: {
        uid,
        status: 'FETCHING_SERVER'
      }
    });
    const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=applyFriend`, {
      token, uid, gid, remark
    });

    if (result.status == 'fail') {
      return dispatch({
        type: 'FRIEND_APPLY_STATUS_UPDATE',
        payload: {
          uid,
          msg: result.msg,
          status: 'FETCHING_SERVER_FAIL'
        }
      });
    }

    dispatch({
      type: 'FRIEND_APPLY_STATUS_UPDATE',
      payload: {
        uid,
        status: 'FETCHING_SERVER_SUCCESS'
      }
    });


  } catch(e){
    alert(e+'applyfriend')
  }
};

/**
 * 用户操作，确认好友申请发送成功
 * @param uid
 */
export const applyFriendClear = (uid) => ({
  type: 'FRIEND_APPLY_STATUS_UPDATE',
  payload: {
    uid,
    status: 'USER_ACTION_CLEAR'
  }
});

/**
 * 获取好友列表
 */
export const getFriendList = () => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const friendGroup = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=getCustomGroup`, {
      token
    });

    let result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=getfriendlist`, {token});
    if (process.env.NODE_ENV == 'development') console.log(JSON.stringify(result));
    if (result && result.status == 'fail') throw result.msg;
    result = result.map(item => {
      if (item.u_ico.indexOf('http') != 0) {
        item.u_ico = `http://www.258m.com/data/upload/shop/avatar/${item.u_ico}`
      }
      if (!item.u_ico.match(/\.jpg$|\.png$|\.gif$/)) {
        item.u_ico = 'https://www.258m.com/data/upload/shop/common/default_user_portrait.gif'
      }
      return item;
    });

    dispatch({
      type: 'FRIEND_LIST_UPDATE',
      payload: {list: result||[]}
    });

  } catch(e){
    console.error(e.stack||e);
    alert(e+'getfriendlist')
  }

};

/**
 * 获取好友分组
*/
export const getCustomGroup = () => async(dispatch, getState) => {
  try {

    const {token} = getState().account;
    const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=getCustomGroup`, {
      token
    });
    if (result.status == 'fail') throw result.msg;
    dispatch({
      type: 'FRIEND_GROUP_LIST_UPDATE',
      payload: {
        groupList: result.list
      }
    })
  } catch(e){
    console.error(e.stack||e);
    alert(e+'getCustomGroup')
  }
};

/**
 * 删除好友
 * @param ids //好友id，多个逗号隔开
 */
export const deleteFriend = (ids) => async (dispatch, getState) => {
  try {

    dispatch({
      type:'FRIEND_DELETE_FRIEND_STATUS_UPDATE',
      payload: {state: 1}
    })


    const {token} = getState().account;
    const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=delfriends`, {
      token, ids
    });

    dispatch({
      type:'FRIEND_DELETE_FRIEND_STATUS_UPDATE',
      payload: {state: result.status == 'success' ? 2 : 3}
    })

    if (result.status == 'success') {
      dispatch({
        type:'FRIEND_DELETE',
        payload: {uid: ids}
      })
    }


  } catch(e){
    alert(e+'deleteFriend')
  }
};

export const resetDeleteFriendState = () => ({
  type: 'FRIEND_DELETE_FRIEND_STATUS_UPDATE',
  payload: {state: 0}
});
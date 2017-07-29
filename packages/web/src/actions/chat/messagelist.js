import {handleActions} from 'redux-actions'
import {POSTUrlencodeJSON, Urlencode, POSTRawJSON} from '../utils/fetch-tools'
import {API_HOST, CHAT_API_HOST} from '../utils/config'
import uuid from 'uuid'

const initialState = {

  // 是否已经初始化
  inited: false,

  // 是否在自动更新
  pulling: false,

  // 是否在手动更新
  manualPulling: false,

  // 存储聊天数据
  // key: `${CHAT_TYPE}__${userId || groupId || 'systemmessage'}`
  // value: [
  //  {
  //    avatar: '',
  //    content: ''
  //  }
  // ]
  messages: {},

  // 存储最近对话列表, 从新到旧排序
  // item: {
  //   time,
  //   latestMessage,
  //   messageType,
  //   avatar,
  //   isRead,
  //   unReadNumber
  // }
  list: [],

  // 存在于这个列表内的item， 当有新消息发生时，消息会自动被标记为已读。
  autoMarkReadList: [],

  // 是否在更新系统消息
  systemMessageUpdating: false,

  // TODO 可以考虑把systemmessage合并到list和messages
  // {isRead， unReadNumber, time} 放到list
  // {key: 'systemmessage', value: list} 放到messages
  systemmessage: {
    list: [], // list.filter(item => item.isHandled == 0).length (未操作条数)
    time: 1,
    untreated: 0
  }
};

export default handleActions({

  MESSAGE_LIST_PULLING: (state, action) => {
    return Object.assign({}, state, {
      pulling: true,
    })
  },

  MESSAGE_LIST_PULLED: (state, action) => {
    return Object.assign({}, state, {
      pulling: false,
    })
  },

  // 更新消息列表
  // 添加未读消息提醒，以及把消息标记为已读（或直接删除）。
  MESSAGE_LIST_UPDATE: (state, action) => {
    return Object.assign({}, state, {
      pulling: false,
      inited: true,
      list: action.payload.list||[]
    })
  },

  MESSAGE_LIST_UPDATE_IMMUTATE_STATUS: (state, action) => {
    return Object.assign({}, state, {
      list: action.payload.list||[]
    })
  },

  // 更新好友请求消息列表
  MESSAGE_LIST_FRIEND_REQUEST_UPDATE: (state, action) => {
    const {systemmessage} = action.payload;

    const nextList = [{
      type: 'FRIEND_REQUEST',
      summary: '新的好友请求',
      isRead: false
    }].concat(state.list.filter(item => item.type != 'FRIEND_REQUEST'));

    return Object.assign({}, state, {
      systemMessageUpdating: false,
      systemmessage,
      // list: nextList
    })
  },

  MESSAGE_LIST_FRIEND_REQUEST_UPDATING: (state, action) => {
    return Object.assign({}, state, {
      systemMessageUpdating: true,
    })
  },

  MESSAGE_LIST_PUSH: (state, action) => {
    const {messages, list, autoMarkReadList} = state;
    const {type, data, displayOpened} = action.payload;
    const nextMessages = Object.assign({}, messages);
    const targetKey = (() => {
      if (type == 'friend') return `${type}__${data.id}`;
      if (type == 'group') return `${type}__${data.id}`;
      return `${type}__${data.id}`;
    })();
    const nextList = list.filter(item => item.key != targetKey);
    const prevItem = list.find(item => item.key == targetKey);
    const currentItem = {
      key: targetKey,
      type,
      avatar: data.avatar,
      username: data.username,
      id: data.id,
      time: data.timestamp,
    };
    const isRead = !displayOpened?false:autoMarkReadList.indexOf(data.id) > -1;
    const unReadNumber = isRead ? 0 : prevItem ? prevItem.unReadNumber+1 : 1;
    Object.assign(currentItem, {isRead, unReadNumber});
    nextList.unshift(currentItem);

    if (!nextMessages.hasOwnProperty(targetKey)) nextMessages[targetKey] = [];
    nextMessages[targetKey].push(data);

    return Object.assign({}, state, {
      list: nextList,
      messages: nextMessages
    })
  },

  MESSAGE_LIST_SYSTEM_MESSAGE_HANDLE: (state, action) => {
    const {systemmessage} = state;
    const {type, data} = action.payload;
    const nextSystemMessage = Object.assign(systemmessage);
    if (type == 'FRIEND_REQUEST') {
      const {rid, bool} = data;
      nextSystemMessage.list = nextSystemMessage.list.map(item => {
        if (item.rid == rid) {
          item.NType = bool?'FRIEND_REQUEST_AGREE':'FRIEND_REQUEST_REFUSE'
        }
        return item;
      })
    }
    return Object.assign({}, state, {systemmessage: nextSystemMessage})
  },

  //
  MESSAGE_LIST_AUTO_MARK_READ: (state, action) => {
    const {type, data} = action.payload;
    const {autoMarkReadList} = state;
    if (autoMarkReadList.indexOf(data.uid) > -1) return state;

    const nextAutoMarkReadList = Object.assign([], autoMarkReadList);
    nextAutoMarkReadList.push(data.uid);
    return Object.assign({}, state, {
      autoMarkReadList: nextAutoMarkReadList
    })

  },

  MESSAGE_LIST_AUTO_MARK_READ_CANCEL: (state, action) => {
    const {type, data} = action.payload;
    const {autoMarkReadList} = state;
    if (autoMarkReadList.indexOf(data.uid) == -1) return state;

    const nextAutoMarkReadList = autoMarkReadList.filter(item => item != data.uid);
    return Object.assign({}, state, {
      autoMarkReadList: nextAutoMarkReadList
    })

  },

  // 将消息标记为已读
  MESSAGE_LIST_MARK_READ: (state, action) => {
    const {type, data} = action.payload;
    if (type == 'FRIEND') {
      const {id} = data;
      const nextList = Object.assign([], state.list).map(item => {
        if (item.id == id){
          item.isRead = true;
          item.unReadNumber = 0;
        }
        return item;
      });
      return Object.assign({}, state, {list: nextList})
    }

    if (type == 'SYSTEM') {
      const nextSystemMessage = Object.assign({}, state.systemmessage);
      nextSystemMessage.isRead = true;
      nextSystemMessage.unReadNumber = 0;
      return Object.assign({}, state, {systemmessage: nextSystemMessage})
    }
  }

}, initialState);

const initIndex = (pals_id) => ({
  // 最新的setId
  latestSetId: 0,
  // 对方的userId
  pals: pals_id,
  // 未读消息数
  unreadNumber: 1,
  // 最新的消息时间
  latestUpdate: Date.now()
  // todo 最后一条消息
  // latestMessage: {},
  // todo 占用存储空间
  // totalSize: 2048
});


// 获取消息列表(http/)
export const pullMessageList = () => async (dispatch, getState) => {
  try {
    const {account, chatwindow, messagelist} = getState();
    const {token} = account;
    const {pals, list} = chatwindow;

    // 初始化消息列表
    if (!messagelist.inited) {
      dispatch({
        type: "MESSAGE_LIST_UPDATE",
        payload: {list: []}
      });
    }

    // tag start, stop the next handle if this handle dos not finished.
    dispatch({type: 'MESSAGE_LIST_PULLING'});
    const result = await POSTUrlencodeJSON(`${API_HOST}/im/ajax.php?act=getmessagelist`, {
      token, pals: `|${pals}`
    });
    if (result.hasOwnProperty('PLEASE_DO_NOTHING')) {
      return dispatch({type: 'MESSAGE_LIST_PULLED'});
    }
    if (result.status == 'fail') {
      return dispatch({type: 'MESSAGE_LIST_PULLED'});
      throw result.msg || result.error;
    }

    // 处理消息列表
    // 如果没有新消息（length == 0）不做处理
    // 如果消息已经在messagelist.list里，则更新latestUpdate时间
    // 消息不在messagelist.list里，则创建index，再merge到messagelist.list
    let unreadList = await Promise.all(
      result.map(item => new Promise(async (resolve, reject) => {
        try {
          resolve(Object.assign({},  {
            unreadNumber: 1,
            latestUpdate: Date.now()
          }))

        } catch(e){
          reject(e)
        }
      }))
    );

    if ( unreadList.length > 0 ) {
      unreadList = unreadList.sort((a, b) => a.latestUpdate - b.latestUpdate > 0?1:-1 );
      const unreadPals = unreadList.map(item => item.pals);
      const currentListFiltered = messagelist.list.filter(item => {
        return unreadPals.indexOf(item.pals) == -1
      });
      const nextMessageList = unreadList.concat(currentListFiltered);
      dispatch({
        type: "MESSAGE_LIST_UPDATE",
        payload: {list: nextMessageList}
      });
    }

    // 处理带内容的消息（即正在聊天的）
    // 在app端，每次只会打开一个窗口，所以上面调用的pals参数只传一个id，这里接收的消息列表里也只会有一个
    // 如果当前没有新消息，不做任何处理
    // 如果当前没有新消息（服务端返回有消息，
    //   但其实没消息，这种情况不应该存在，但目前的数据结构可能会有这种情况），也不做任何处理
    const currentChatList = result.filter(item => item.pals_id == pals);
    if (currentChatList.length == 0) return dispatch({type: 'MESSAGE_LIST_PULLED'});
    if (currentChatList[0].message instanceof Array == false) return dispatch({type: 'MESSAGE_LIST_PULLED'});

    const currentSet = currentChatList[0].message.map(item => {
      const {txt, time, id} = item;
      const _id = uuid.v1();
      return {txt, time, _id, pals: id}
    });
    if (currentSet.length == 0) return dispatch({type: 'MESSAGE_LIST_PULLED'});

    // 读取并更新AsyncStorage中的index数据（索引数据）和set数据（消息内容集合）
    // 如果还没创建这个index， 创建index
    // 如果最新的set大小超过20，则更新index，并添加一个新的set

    // 更新chatwindow
    const nextChatWindowList = list.concat(currentSet).filter(item => !item.hasOwnProperty('temp'));
    dispatch({
      type: 'CHAT_WINDOW_LIST_UPDATE',
      payload: {list: nextChatWindowList}
    });

    // tag end
    dispatch({type: 'MESSAGE_LIST_PULLED'})

  } catch(e){
    dispatch({type: 'MESSAGE_LIST_PULLED'});
    alert(e+'pullmessagelist')
  }
};


/**
 * 发送消息
 * @param type
 * @param id
 * @param content
 */
export const sendMessage = (type, id, content) => async(dispatch, getState) =>  {
  try {
    const {account, friends} = getState()
    const {token, userinfo} = account;
    const {uid, member_avatar, member_name} = userinfo;

    const friend = friends.list.find(item => item.pals_id == id);

    // todo 先加入到消息列表
    dispatch(pushMessage(type, {
      avatar: friend.u_ico, // 对方的头像
      content, // 内容
      from_id: uid, // 用户的id
      id,
      timestamp: Date.now(),
      type,
      username: friend.u_name, // 对方的用户名
    }));

    const result = await POSTUrlencodeJSON(`${CHAT_API_HOST}/send_message.php`, {
      token,
      data: {
        to: {type, id},
        mine: {content}
      }
    });


    // todo 再根据返回结果更新这条消息（已经在消息列表）的状态
    if (result.status == 'fail') {
      // dispatch fail
    } else {
      // dispatch success
    }


  } catch(e){
    console.error(e.stack||e);
    alert(e)
  }

};


/**
 * 获取系统消息
 */
export const getSystemMessage = () => async(dispatch, getState) => {
  try {
    dispatch({
      type: "MESSAGE_LIST_FRIEND_REQUEST_UPDATING"
    });
    const {token} = getState().account;
    const {systemmessage} = getState().messagelist;
    const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=gethistorymessage`, {
      time: systemmessage.time,
      token
    });
    // alert(JSON.stringify(result));
    if (result.status == 'fail') throw result.msg;
    let list = result.list || [];


    // todo 服务端添加系统消息类型
    list = list.map(item => {
      const status = Number(item.status);
      if(Number(item.from_id) > 0 ){
        if (status==1) item.NType = 'FRIEND_REQUEST_AGREE';
        if (status==2) item.NType = 'FRIEND_REQUEST_REFUSE';
        if (status==0) item.NType = 'FRIEND_REQUEST';
      }
      // if (content.indexOf('您删除了') > -1) item.NType = 'FRIEND_DELETE';
      return item;
    });
    const nextList = list.concat(systemmessage.list);

    dispatch({
      type: 'MESSAGE_LIST_FRIEND_REQUEST_UPDATE',
      payload: {
        systemmessage: {
          list: nextList,
          untreated: result.untreated,
          time: nextList[0].time
        }
      }
    })

  } catch(e){
    alert(e+'getsystemmessage')
  } finally {
    // todo
    // if (getState().messagelist.systemmessage.loading)
  }
};



/**
 * 处理好友申请
 * @param bool  true统一， false拒绝
 * @param {string} rid 记录id
 * @param {string} gid 我的好友分组id
 */
export const handleFriendRequest = (bool, rid, gid) => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const agree = () => POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=agreefriend`, {
      token, rid, gid
    });
    const refuse = () => POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=refusefriend`, {
      token, rid
    });

    const result = await (bool?agree():refuse());
    if (result.status == 'fail') throw result.msg;

    dispatch({
      type: 'MESSAGE_LIST_SYSTEM_MESSAGE_HANDLE',
      payload: {
        type: 'FRIEND_REQUEST',
        data: {rid, bool},
      }
    });

    dispatch(getSystemMessage());


  } catch(e){
    alert(e+'处理好友申请')
  }
};


/**
 * pushPrivateMessage
 */
export const pushMessage = (type, data) => (dispatch, getState) => {
  dispatch({
    type: 'MESSAGE_LIST_PUSH',
    payload: {
      type,
      data,
      displayOpened: getState().display.opened
    }
  })
};

/**
 * 标记消息已读
 * @param type FRIEND, SYSTEM
 * @param data
 */
export const markRead = (type, data) => (dispatch, getState) => {
  dispatch({
    type: 'MESSAGE_LIST_MARK_READ',
    payload: {
      type,
      data
    }
  })
};

/**
 * 加入自动标记已读任务
 */
export const pushAutoMarkRead = (uid) => (dispatch, getState) => {
  dispatch({
    type: 'MESSAGE_LIST_AUTO_MARK_READ',
    payload: {
      type: 'FRIEND',
      data: {uid}
    }
  })
};

/**
 * 取消自动标记已读任务
 */
export const cancelAutoMarkRead = (uid) => (dispatch, getState) => {
  dispatch({
    type: 'MESSAGE_LIST_AUTO_MARK_READ_CANCEL',
    payload: {
      type: 'FRIEND',
      data: {uid}
    }
  })
};

/**
 * 当聊天窗口打开时，自动标记已读
 */
export const checkAutoMarkRead = () => (dispatch, getState) => {
  const {display, messagelist} = getState();
  if (display.opened) {
    if (messagelist.autoMarkReadList.length > 0) {
      dispatch(markRead('FRIEND', {id: messagelist.autoMarkReadList[0]}))
    }
  }
};
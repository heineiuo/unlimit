import {handleActions} from 'redux-actions'
import {POSTUrlencodeJSON} from '../utils/fetch-tools'
import {API_HOST, CHAT_API_HOST, CHAT_WS_HOST} from '../utils/config'
import {pushMessage} from './messagelist'

let ws = null;

const initialState = {
  ws_state: 0, // 0没有连接， 1，正在连接，2是已连接
  started: false
};

export default handleActions({

  WS_STATE_CHANGE(state, action) {
    return {
      ws_state: action.payload.ws_state
    }
  },

  WS_START (state, action) {
    return {
      ws_state: 2,
    }
  },

  WS_STOP (state, action) {
    return {
      ws_state: 1,
    }
  }

}, initialState);


export const startIM = () => async (dispatch, getState) => {

  dispatch({
    type: 'WS_STATE_CHANGE',
    payload: {
      ws_state: 1
    }
  });

  const {account} = getState();

  // const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=userinfo`, {
  //   token: account.token
  // });

  ws = new WebSocket(`${CHAT_WS_HOST}`);

  ws.onopen = () => {
    // connection opened

    dispatch({
      type: 'WS_START',
    });

    ws.send(JSON.stringify({type: 'init'})); // send a message

  };

  ws.onmessage = async (e) => {
    const msg = JSON.parse(e.data);

    try {

      switch (msg.message_type) {
        case 'init':
          const result = await POSTUrlencodeJSON(`${CHAT_API_HOST}/bind.php`, {
            client_id: msg.client_id,
            token: account.token
          });
          if (result.status == 'success') {
            result.list.map(item => {
              const {avatar, content, from_id, id, timestamp, type, username} = JSON.parse(item);
              dispatch(pushMessage(type, {avatar, content, from_id, id, timestamp, type, username}));
            })
          } else {
            console.error(result.msg)
          }
          break;

        case 'chatMessage':
          const {avatar, content, from_id, id, timestamp, type, username} = msg.data;
          dispatch(pushMessage(type, {avatar, content, from_id, id, timestamp, type, username}));

          break;

        case 'add':
          if (process.env.NODE_ENV == 'development') console.log(msg);
          break;

        case 'logout':
          break;

        default:
          console.error('未知消息类型');
          break;
      }

    } catch(e){
      console.error(e)
    }


  };

  ws.onerror = (e) => {
    // an error occurred
    console.error(e.message);
  };

  ws.onclose = (e) => {
    // connection closed
    console.error(e.code);
    console.error(e.reason);
    dispatch(stopIM());
  };
};

export const stopIM = () => (dispatch) => {
  dispatch(startIM());
  dispatch({
    type: 'WS_STOP'
  })
};

import { handleActions } from 'redux-actions'
import {API_HOST, CHAT_API_HOST} from '../utils/config'
import {POSTUrlencodeJSON} from '../utils/fetch-tools'
import {push} from 'react-router-redux'
import moment from 'moment'
import 'moment/locale/zh-cn'
import tinyCookie from 'tiny-cookie'
import {getSystemMessage} from  './messagelist'

const initialState = {
  loginChecked: false,
  logged: false,
  token: null,
  loginError: null,
  isUserinfoGotAtLeastOnce: false,
  userinfo: {}
};

const noop = () => {};

export default handleActions({

  ACCOUNT_LOGIN_CHECKED (state, action) {
    return Object.assign({}, state, action.payload, {
      loginChecked: true,
      isUserinfoGotAtLeastOnce: true
    })
  },

  ACCOUNT_LOGOUT (state, action) {
    return Object.assign({}, state, {
      logged: false
    })
  },

  ACCOUNT_LOGIN_SUCCESS (state, action){
    return Object.assign({}, state, {
      logged: true,
      loginError: null
    })
  },

  ACCOUNT_LOGIN_FAIL (state, action) {
    return Object.assign({}, state, {
      loginError: action.loginError
    })
  },

  // 更新用户信息
  ACCOUNT_USERINFO_UPDATE (state, action) {
    return Object.assign({}, state, {
      isUserinfoGotAtLeastOnce: true,
      userinfo: action.payload.userinfo
    })
  },

}, initialState)

const getUserInfoPromise = (token) => new Promise(async (resolve, reject) => {
  try {

  } catch(e){
    reject(e)
  }
});

/**
 * 账号初始化
 */
export const accountInit = () => async(dispatch, getState) => {
  try {

    const requestUserInfo = (token) => POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=userinfo`, {
      token
    });

    const handleSuccess = (result, token) => {
      const userinfo = result.detail;
      if (!userinfo.member_avatar || !userinfo.member_avatar.match(/\.jpg$|\.png$|\.gif$/)) {
        userinfo.member_avatar = 'https://www.258m.com/data/upload/shop/common/default_user_portrait.gif'
      }
       dispatch({
        type: 'ACCOUNT_LOGIN_CHECKED',
        payload: {
          token,
          userinfo,
          logged: true
        }
      })

      dispatch(getSystemMessage())
    };

    // only for development
    // if (process.env.NODE_ENV == 'development' && localStorage.token) {
    //   const token = localStorage.token;
    //   const result = await requestUserInfo(token);
    //   if (result.status == 'success') {
    //     return handleSuccess(result)
    //   }
    //
    //   // 失败，清楚token，并通过其他方式获取token和userinfo
    //   localStorage.removeItem('token');
    // }


    // todo
    moment.locale('zh-cn');

    console.log(getState().account.token)

    if (getState().account.token) {
      debugger
      const token = getState().account.token;
      const result = await requestUserInfo(token);
      if (result.status == 'success') {
        return handleSuccess(result, token)
      }
    }

    dispatch({
      type: 'ACCOUNT_LOGIN_CHECKED',
      payload: {logged: false}
    });

    //
    // // const SESSION_ID = tinyCookie.get('258m_ID');
    // // if (!SESSION_ID) throw 'NOT_LOGGED';
    // const result = await POSTUrlencodeJSON(`${CHAT_API_HOST}/token.php`, {
    //   // '258m_ID': SESSION_ID
    // }, {
    // });
    //
    // if (result.status == 'fail') throw result.msg;
    //
    // const token = result.detail;
    // const result2 = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=userinfo`, {
    //   token
    // });
    //
    // const userinfo = result2.detail;
    // if (!userinfo.member_avatar || !userinfo.member_avatar.match(/\.jpg$|\.png$|\.gif$/)) {
    //   userinfo.member_avatar = 'https://www.258m.com/data/upload/shop/common/default_user_portrait.gif'
    // }
    //
    // dispatch({
    //   type: 'ACCOUNT_LOGIN_CHECKED',
    //   payload: result.hasOwnProperty('detail')?
    //     {token: result.detail, logged: true, userinfo}:
    //     {logged: false}
    // })

  } catch(e){
    console.error(e);
    dispatch({
      type: 'ACCOUNT_LOGIN_CHECKED',
      payload: {
        logged: false
      }
    })
  }
};


/**
 * login
 * only for development
 * @param username
 * @param password
 */
export const login = (username, password) => async (dispatch, getState) => {
  const errorHandle = console.error;

  try {
    const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=login`, {
      username,
      password
    });

    if (result.status == 'fail') return errorHandle(result.msg);

    if (result.hasOwnProperty('token')){
      localStorage.setItem('token', result.token);
      dispatch({
        type: 'ACCOUNT_LOGIN_CHECKED',
        payload: {token: result.token, logged: true}
      });
      dispatch(getUserInfo());
      if (process.env.NODE_ENV == 'development') {
        dispatch(getSystemMessage());
      }

    }

    dispatch(push('/'))

  } catch(e){
    errorHandle(e)
  }
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => async (dispatch, getState) => {
  try {
    const {token} = getState().account;
    const result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=userinfo`, {
      token
    });
    if (result.status == 'fail') throw result.msg;
    dispatch({
      type: 'ACCOUNT_USERINFO_UPDATE',
      payload: {
        userinfo: result.detail
      }
    })

  } catch(e){
    console.error(e)
  }
};
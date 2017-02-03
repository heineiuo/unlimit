import {handleActions} from 'redux-actions'
import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'

const API_HOST = 'https://www.youkuohao.com/api/account';
const signature = (params) => params;

const initialState = {
  loginChecked: false,
  logged: false,
  email: '',
  registerVerifyCodeCount: 0,
  registerError: '',
  loginError: '',
  resetPasswordError:'',
  redirectUrl: '',
  profile: {},
  questions:[],
  title:'',
  key: '',
  description:'初始值'
};

export default handleActions({

  ACCOUNT_LOGOUT (state, action) {
    return Object.assign({}, initialState, {
      loginChecked: true
    })
  },

  CHECKED_LOGIN (state, action ) {
    return Object.assign({}, state, {
      logged: action.logged,
      loginChecked: true,
      redirectUrl: action.redirectUrl,
      profile: action.profile || {}
    }, action.payload)
  },

  RESET_PASSWORD_ERROR (state,action) {
    return Object.assign({},state,{
      resetPasswordError:action.error
    })
  },

  REST_PASSWORD_SUCCESS (state,action) {
    return Object.assign({},state,{
      resetPasswordError:'',
      logged: true
    })
  },

  REGISTER_ERROR (state, action) {
    console.log(action.error)
    return Object.assign({}, state, {
      registerError: action.error
    })
  },

  REGISTER_SUCCESS (state, action) {
    return Object.assign({}, state, {
      registerError: '',
      logged: true
    })
  },

  LOGIN_ERROR (state, action) {
    return Object.assign({}, state, {
      loginError: action.error
    })
  },

  LOGIN_SUCCESS (state, action) {
    return Object.assign({}, state, {
      loginError:'',
      email: action.payload.email,
      logged: true
    })
  },

  UPDATE_REGISTER_VERIFY_CODE_COUNT (state, action) {
    return Object.assign({}, state, {
      registerVerifyCodeCount: action.count
    })
  },

  HELP_QUESTION (state, action) {
    return Object.assign({}, state, {
      questions: action.questions || []
    })
  },

}, initialState)


export const login = (formData) => async (dispatch, getState) => {
  try {
    const result = await POSTUrlencodeJSON(`${API_HOST}/token/gettokenbyemailcode`, signature({
      email: formData.email,
      code: formData.code
    }));

    if (result.error) throw result.error;
    localStorage.userId = result.userId;
    localStorage.userToken = result.token;
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        email: result.email
      }
    })

  } catch(e){
    console.log(e);
    dispatch({
      type: "LOGIN_ERROR",
      error: e
    })
  }
};

export const logout = () => async (dispatch, getState) => {
  try {
    console.log('正在登出系统...');
    const result = await POSTUrlencodeJSON(`${API_HOST}/token/logout`, signature({
      token: localStorage.userToken
    }));
    if (result.error) throw result.error;
    localStorage.clear();
    dispatch({
      type: 'ACCOUNT_LOGOUT'
    });
    dispatch(push('/'));
  } catch (e) {
    console.log(e.stack || e)
  }
};

/**
 * 发送验证码
 * @param form
 * @returns {function()}
 */
export const sendVerifyCode = (form) => async (dispatch, getState) => {
  try {
    const {registerVerifyCodeCount} = getState().account;
    if (registerVerifyCodeCount>0) return console.log('count not finish.');

    const result = await POSTUrlencodeJSON(`${API_HOST}/token/gettokenbyemailcode`, signature({email: form.email}));
    if (result.error) throw result.error;

    const countdown = (count) => {
      dispatch({
        type: 'UPDATE_REGISTER_VERIFY_CODE_COUNT',
        count: count
      });
      if (count > 0){
        count --;
        setTimeout(()=>{countdown(count)}, 1000)
      }
    };
    countdown(60)
  } catch(error){
    console.log(error.stack||error)
  }
};


/**
 * 检查登录
 * @returns {function()}
 */
export const checkLogin = (redirectUrl='') => async (dispatch, getState) => {
  try {
    const userToken = localStorage.userToken || null;
    if (!userToken) {
      return dispatch({
        type: "CHECKED_LOGIN",
        logged: false,
        redirectUrl: redirectUrl
      })
    }

    const result = await POSTUrlencodeJSON(`${API_HOST}/session`,
      signature({token: userToken})
    );
    if (result.error || result.user == null) {
      return dispatch({
        type: 'CHECKED_LOGIN',
        logged: false,
        redirectUrl: redirectUrl
      })
    }

    dispatch({
      type: 'CHECKED_LOGIN',
      logged: true,
      payload: {
        email: result.user.email
      },
      profile: result,
      redirectUrl: redirectUrl
    })
  } catch(e){
    console.log(e.stack||e)
  }
};

/**
 * 获取授权码
 * @returns {function()}
 */
export const getAuthCodeAndRedirect = () => async (dispatch, getState) => {
  try {
    const {userToken=null} = localStorage;
    const {redirectUrl} = getState().account;
    const res = await POSTUrlencodeJSON(`${API_HOST}/ssocode/get`,
      signature({token: userToken})
    );
    if (res.error) return console.log(res.error);
    location.href = `${redirectUrl}?code=${res.code}`
  } catch(e){
    console.log(e.stack||e)
  }
};
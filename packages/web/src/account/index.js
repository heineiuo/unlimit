import {handleActions} from 'redux-actions'
import { injectAsyncReducer } from '@react-web/store' 
import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
import api from '../api'


const initialState = {
  loginChecked: false,
  logged: false,
  email: '',
  registerVerifyCodeCount: 0,
  registerError: '',
  loginError: '',
  resetPasswordError:'',
  profile: {},
  questions:[],
  title:'',
  token:'',
  key: '',
  description:'初始值'
};


injectAsyncReducer('account', handleActions({

  account__logout (state, action) {
    return Object.assign({}, initialState, {
      loginChecked: true
    })
  },

  account__checkedLogin (state, action ) {
    return Object.assign({}, state, action.payload, {
      loginChecked: true
    })
  },

  account__resetPasswordError (state,action) {
    return Object.assign({},state,{
      resetPasswordError:action.error
    })
  },

  account__resetPasswordSuccess (state,action) {
    return Object.assign({},state,{
      resetPasswordError:'',
      logged: true
    })
  },

  account__registerError (state, action) {
    return Object.assign({}, state, {
      registerError: action.error
    })
  },

  account__registerSuccess (state, action) {
    return Object.assign({}, state, {
      registerError: '',
      logged: true
    })
  },

  account__loginError (state, action) {
    return Object.assign({}, state, {
      loginError: action.error
    })
  },

  account__loginSuccess (state, action) {
    return Object.assign({}, state, {
      loginError:'',
      email: action.payload.email,
      token: action.payload.token,
      logged: true
    })
  },

  account__updateRegisterVerifyCodeCount (state, action) {
    return Object.assign({}, state, {
      registerVerifyCodeCount: action.count
    })
  },

  account__helpQuestionUpdate (state, action) {
    return Object.assign({}, state, {
      questions: action.questions || []
    })
  },

}, initialState))

/**
 * 检查登录
 * @returns {function()}
 */
export const checkLogin = () => async (dispatch, getState) => {
  const userToken = localStorage.userToken || null;
  if (!userToken) {
    return dispatch({
      type: "account__checkedLogin",
      payload: {
        logged: false
      }
    })
  }

  const result = await new Fetch(api.session, {
    token: userToken
  }).post();

  if (result.error || !result.hasOwnProperty('userId')) {
    return dispatch({
      type: 'account__checkedLogin',
      payload: {
        logged: false
      }
    })
  }

  dispatch({
    type: 'account__checkedLogin',
    payload: {
      logged: true,
      email: result.email,
      token: userToken,
      profile: result
    },
  })
};






/**
 * 获取授权码
 * @returns {function()}
 */
export const getAuthCodeAndRedirect = () => async (dispatch, getState) => {
  const {userToken=null} = localStorage;
  const {redirectUrl} = getState().account;
  const res = await new Fetch(api.mutateCreateAuthCode, {
    token: userToken
  }).post();

  if (res.error) return console.log(res.error);
  location.href = `${redirectUrl}?code=${res.code}`

};




export const login = (formData) => async (dispatch, getState) => {
  const result = await new Fetch(api.mutateCreateToken, {
    email: formData.email,
    code: formData.code
  }).post();

  if (result.error) {
    console.log(result.error);
    return dispatch({
      type: "account__loginError",
      error: result.error
    })
  }
  localStorage.userId = result.userId;
  localStorage.userToken = result.token;
  dispatch({
    type: 'account__loginSuccess',
    payload: {
      token: result.token,
      email: result.email
    }
  })
};


export const logout = () => async (dispatch, getState) => {
  console.log('正在登出系统...');
  const result = await new Fetch(api.mutateDeleteToken, {
    token: localStorage.userToken
  });

  if (result.error) return console.log(result.error);
  localStorage.clear();
  dispatch({
    type: 'account__logout'
  });
  dispatch(push('/'));
};



export const queryOneByEmail = ({email, driveId}) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const result = await new Fetch(api.accountQueryOne,{
    token, email
  }).post()
  if (result.error) return alert(result.error)
  // todo 将结果放到搜索框提示菜单
}




/**
 * 发送验证码
 * @param form
 * @returns {function()}
 */
export const sendVerifyCode = (form) => async (dispatch, getState) => {
  const {registerVerifyCodeCount} = getState().account;
  if (registerVerifyCodeCount > 0) return console.log('count not finish.');
  const countdown = (count) => {
    dispatch({
      type: 'account__updateRegisterVerifyCodeCount',
      count: count
    });
    if (count > 0){
      count --;
      setTimeout(()=>{countdown(count)}, 1000)
    }
  };

  const result = await new Fetch(api.mutateCreateVerificationCode, {
    email: form.email
  }).post();

  if (result.error) return console.log(result.error);
  countdown(60)
};

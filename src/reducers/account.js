import {handleActions} from 'redux-actions'

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

export default handleActions({

  ACCOUNT_LOGOUT (state, action) {
    return Object.assign({}, initialState, {
      loginChecked: true
    })
  },

  CHECKED_LOGIN (state, action ) {
    return Object.assign({}, state, action.payload, {
      loginChecked: true
    })
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
      token: action.payload.token,
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

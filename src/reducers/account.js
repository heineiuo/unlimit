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

}, initialState)

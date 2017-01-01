import { handleActions } from 'redux-actions'

const initialState = {
  loginChecked: false,
  logged: false,
  token: null,
  loginError: null
};

export default module.exports = handleActions({

  ACCOUNT_LOGIN_CHECKED (state, action) {
    return Object.assign({}, state, action.payload, {loginChecked: true})
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
  }

}, initialState)

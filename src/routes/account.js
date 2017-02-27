import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {logout, checkLogin, sendVerifyCode, getAuthCodeAndRedirect} from '../store/account'

module.exports = (injectAsyncReducer) => {

  return (
    <Route>
      <IndexRoute getComponent={asyncAccountCheck}/>
    </Route>
  )
};

const asyncAccountCheck = (nextState, cb) => {
  require.ensure([], (require) => {
    const Component = require('../components/Account/Check');
    const ConnectedComponent = connect(
      (state) => ({
        account: state.account
      }),
      (dispatch) => bindActionCreators({
        logout,
        checkLogin,
        sendVerifyCode,
        getAuthCodeAndRedirect
      }, dispatch)
    )(Component);
    cb(null, ConnectedComponent)
  })
};
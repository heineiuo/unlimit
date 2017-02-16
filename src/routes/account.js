import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

module.exports = (injectAsyncReducer) => {
  return (
    <Route>
      <IndexRoute
        getComponent={(nextState, cb) => {
          require.ensure([], (require) => {
            const account = require('../store/account');
            const Component = require('../components/Account/Check');
            const ConnectedComponent = connect(
              (state) => ({
                account: state.account
              }),
              (dispatch) => bindActionCreators({
                checkLogin: account.checkLogin,
                getAuthCodeAndRedirect: account.getAuthCodeAndRedirect
              }, dispatch)
            )(Component);
            cb(null, ConnectedComponent)
          })
        }}
      />
    </Route>
  )
};

import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

module.exports = (injectAsyncReducer) => {

  const asyncIntegrateApp = (nextState, callback) => {
    require.ensure([], (require) => {
      const Component = require('../components/IntegrateApp');
      const ConnectedComponent = connect(
        (state) => ({
          account: state.account,
        }),
        (dispatch) => bindActionCreators({
        }, dispatch),
        (stateProps, dispatchProps, ownProps) => {
          return Object.assign({}, ownProps, {
            injectAsyncReducer
          })
        }
      )(Component);

      callback(null, ConnectedComponent)
    })
  };

  return (
    <Route>
      <Route path=":appName" getComponent={asyncIntegrateApp}/>
    </Route>
  )
};

import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

module.exports = (injectAsyncReducer) => {

  return (
    <Route>
      <IndexRoute getComponent={asyncAuth}/>
    </Route>
  )
};


const asyncAuth = (nextState, callback) => {
  require.ensure([], (require) => {
    callback(null, require('../components/Account/Auth/Auth2').default)
  })
};
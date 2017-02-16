import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

module.exports = (injectAsyncReducer) => {

  const account = require('../store/account');
  const postList = require('../store/feed/postList');

  const getCheckLogin = (partialNextState, callback) => {
    console.error('why it happened again !!!');

    const CheckLogin = require('../components/CheckLogin');
    const CheckLoginConnect = connect(
      (store) => ({
        account: store.account,
        postList: store.postList
      }),
      (dispatch) => bindActionCreators({
        checkLogin: account.checkLogin,
      }, dispatch)
    )(CheckLogin);
    callback(null, CheckLoginConnect)
  };

  const connectCheckLogin = (CheckLogin) => {
    return connect(
      (store) => ({
        account: store.account,
        postList: store.postList
      }),
      (dispatch) => bindActionCreators({
        checkLogin: account.checkLogin,
      }, dispatch)
    )(CheckLogin);
  };

  const asyncHome = (partialNextState, callback) => {
    require.ensure([], (require) => {
      const Home = require('../components/Home');
      const HomeConnect = connect(
        (store) => ({
          account: store.account,
          postList: store.postList,
        }),
        (dispatch) => bindActionCreators({
          getPostList: postList.getPostList
        }, dispatch)
      )(Home.default);
      callback(null, HomeConnect)
    })
  };

  return (
    <Route component={connectCheckLogin(require('../components/CheckLogin'))}>
      <Route path="/" getComponent={asyncHome}/>
      <Route path="/drive" getChildRoutes={(partialNextState, callback) => {
        require.ensure([], (require) => {
          callback(null, [require('./drive')(injectAsyncReducer)])
        })
      }} />
      <Route path="/account" getChildRoutes={(partialNextState, callback) => {
        require.ensure([], (require) => {
          callback(null, [require('./account')(injectAsyncReducer)])
        })
      }} />
      <Route path="/auth" getChildRoutes={(partialNextState, callback) => {
        require.ensure([], (require) => {
          callback(null, [require('./auth')(injectAsyncReducer)])
        })
      }} />
    </Route>
  )
};
import React, {Component} from 'react'
import {Router, Route, IndexRoute, IndexRedirect} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

import host, {
  createHost, getHostList, deleteHost,
  getLocations, commitLocations
} from '../store/host'
import file, {restoreFileList, getFileList, deleteFile} from '../store/file'
import nav, {setTitle} from '../store/nav'

module.exports = (injectAsyncReducer) => {

  injectAsyncReducer('host', host);
  injectAsyncReducer('file', file);
  injectAsyncReducer('nav', nav);

  const connectDriveMaster = connect(
    (store) => ({
      account: store.account,
      host: store.host,
      nav: store.nav
    }),
    (dispatch) => bindActionCreators({
      getHostList,
      deleteHost,
      createHost
    }, dispatch)
  );

  const asyncHostList = (nextRoute, callback) => {
    const Component = require('../components/Drive/HostList');
    const ConnectedComponent = connect(
      (state) => ({
        host: state.host,
      }),
      (dispatch) => bindActionCreators({
        push,
        setTitle,
        getHostList,
        restoreFileList
      }, dispatch)
    )(Component);
    callback(null, ConnectedComponent)
  };

  const asyncHostWrapper = (nextState, callback) => {
    const Component = require('../components/Drive/HostWrapper');
    const ConnectedComponent = connect(
      (state) => ({
        host: state.host,
      }),
      (dispatch) => bindActionCreators({
        push,
        setTitle,
        getHostList,
        restoreFileList
      }, dispatch)
    )(Component);
    callback(null, ConnectedComponent)
  };

  const asyncHostFile = (partialNextState, callback) => {
    const Component = require('../components/Drive/File');
    const ConnectedComponent = connect(
      (state) => ({
        account: state.account,
        host: state.host,
        file: state.file,
      }),
      (dispatch) => bindActionCreators({
        push,
        getFileList,
        deleteFile,
        setTitle,
        getHostList,
        restoreFileList,
      }, dispatch),
      (stateProps, dispatchProps, ownProps) => {
        return Object.assign({}, stateProps, dispatchProps, ownProps, {
          injectAsyncReducer
        })
      }
    )(Component);
    callback(null, ConnectedComponent)
  };

  const asyncLocation = (partialNextState, callback) => {
    require.ensure([], (require) => {
      const Component = require('../components/Drive/Location');
      const ConnectedComponent = connect(
        (state) => ({
          host: state.host,
        }),
        (dispatch) => bindActionCreators({
          push,
          setTitle,
          getLocations,
          getHostList,
          commitLocations,
          restoreFileList,
          //editLocationSort,
          // editLocation,
          // createLocation
        }, dispatch)
      )(Component);
      callback(null, ConnectedComponent)
    })
  };


  return (
    <Route component={connectDriveMaster(require('../components/Drive/Master'))}>
      <IndexRoute getComponent={asyncHostList}/>
      <Route path=":hostname" getComponent={asyncHostWrapper}>
        <IndexRedirect to="file" />
        <Route path="file**" getComponent={asyncHostFile}/>
        <Route path="setting" component={require('../components/Drive/Setting')}/>
        <Route path="location" getComponent={asyncLocation} />
      </Route>
    </Route>
  )

};



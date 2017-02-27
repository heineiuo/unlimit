import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

import host, {createHost, getHostList, deleteHost, editLocation, createLocation,
  switchHost, getLocation, editLocationSort} from '../store/host'
import file, {restoreFileList, getFileList, deleteFile} from '../store/file'
import nav, {setTitle} from '../store/nav'

module.exports = (injectAsyncReducer) => {

  injectAsyncReducer('host', host);
  injectAsyncReducer('file', file);
  injectAsyncReducer('nav', nav);

  return (
    <Route component={connectDriveMaster(require('../components/Drive/Master'))}>
      <IndexRoute getComponent={asyncHostList}/>
      <Route path=":hostname" getComponent={asyncHostWrapper}>
        <IndexRoute getComponent={asyncHostFile}/>
        <Route path="file" getComponent={asyncHostFile}/>
        <Route path="setting" component={require('../components/Drive/Setting')}/>
        <Route path="location">
          <IndexRoute getComponent={asyncLocation}/>
          <Route path="new" getComponent={asyncLocationDetail}/>
          <Route path="pathname" getComponent={asyncLocationDetail}/>
        </Route>
      </Route>
    </Route>
  )

};


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

const asyncLocationDetail = (partialNextState, callback) => {
  require.ensure([], (require) => {
    const Component = require('../components/Drive/LocationDetail');
    const ConnectedComponent = connect(
      (state) => ({
        host: state.host,
      }),
      (dispatch) => bindActionCreators({
        push,
        setTitle,
        editLocation,
        createLocation
      }, dispatch)
    )(Component);
    callback(null, ConnectedComponent)
  })
};

const asyncHostList = (nextRoute, callback) => {
  const Component = require('../components/Drive/HostList');
  const ConnectedComponent = connect(
    (state) => ({
      host: state.host,
    }),
    (dispatch) => bindActionCreators({
      push,
      setTitle,
      switchHost,
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
      switchHost,
      getHostList,
      restoreFileList
    }, dispatch)
  )(Component);
  callback(null, ConnectedComponent)
};

const asyncHostFile = (partialNextState, callback) => {
  const Component = require('../components/Drive/HostFile');
  const ConnectedComponent = connect(
    (state) => ({
      host: state.host,
      file: state.file,
    }),
    (dispatch) => bindActionCreators({
      push,
      switchHost,
      getFileList,
      deleteFile,
      setTitle,
      getHostList,
      restoreFileList,
    }, dispatch)
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
        getLocation,
        switchHost,
        getHostList,
        editLocationSort,
        restoreFileList
      }, dispatch)
    )(Component);
    callback(null, ConnectedComponent)
  })
};



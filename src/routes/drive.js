import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

module.exports = (injectAsyncReducer) => {

  const host = require('../store/host');
  const file = require('../store/file');
  const nav = require('../store/nav');

  injectAsyncReducer('host', host.default);
  injectAsyncReducer('file', file.default);
  injectAsyncReducer('nav', nav.default);

  const connectDriveMaster = connect(
    (store) => ({
      account: store.account,
      host: store.host,
      nav: store.nav
    }),
    (dispatch) => bindActionCreators({
      getHostList: host.getHostList,
      deleteHost: host.deleteHost
    }, dispatch)
  );

  const getLocationDetail = (partialNextState, callback) => {
    require.ensure([], (require) => {
      const Component = require('../components/Drive/LocationDetail');
      const ConnectedComponent = connect(
        (state) => ({
          host: state.host,
        }),
        (dispatch) => bindActionCreators({
          push,
          setTitle: nav.setTitle,
          editLocation: host.editLocation,
          createLocation: host.createLocation
        }, dispatch)
      )(Component);
      callback(null, ConnectedComponent)
    })
  };

  const getHostList = (nextRoute, callback) => {
    const Component = require('../components/Drive/HostList');
    const ConnectedComponent = connect(
      (state) => ({
        host: state.host,
      }),
      (dispatch) => bindActionCreators({
        push,
        switchHost: host.switchHost,
        setTitle: nav.setTitle,
        getHostList: host.getHostList,
        restoreFileList: file.restoreFileList,
      }, dispatch)
    )(Component);
    callback(null, ConnectedComponent)
  };

  const getHostWrapper = (nextState, callback) => {
    const Component = require('../components/Drive/HostWrapper');
    const ConnectedComponent = connect(
      (state) => ({
        host: state.host,
      }),
      (dispatch) => bindActionCreators({
        push,
        switchHost: host.switchHost,
        setTitle: nav.setTitle,
        getHostList: host.getHostList,
        restoreFileList: file.restoreFileList,
      }, dispatch)
    )(Component);
    callback(null, ConnectedComponent)
  };

  const getHostFile = (partialNextState, callback) => {
    const Component = require('../components/Drive/HostFile');
    const ConnectedComponent = connect(
      (state) => ({
        host: state.host,
        file: state.file,
      }),
      (dispatch) => bindActionCreators({
        push,
        switchHost: host.switchHost,
        getFileList: file.getFileList,
        setTitle: nav.setTitle,
        getHostList: host.getHostList,
        restoreFileList: file.restoreFileList,
      }, dispatch)
    )(Component.default);
    callback(null, ConnectedComponent)
  };

  const getLocation = (partialNextState, callback) => {
    require.ensure([], (require) => {
      const Component = require('../components/Drive/Location');
      const ConnectedComponent = connect(
        (state) => ({
          host: state.host,
        }),
        (dispatch) => bindActionCreators({
          push,
          getLocation: host.getLocation,
          switchHost: host.switchHost,
          setTitle: nav.setTitle,
          getHostList: host.getHostList,
          restoreFileList: file.restoreFileList,
        }, dispatch)
      )(Component.default);
      callback(null, ConnectedComponent)
    })
  };

  return (
    <Route component={connectDriveMaster(require('../components/Drive/Master'))}>
      <IndexRoute getComponent={getHostList}/>
      <Route path=":hostname" getComponent={getHostWrapper}>
        <IndexRoute getComponent={getHostFile}/>
        <Route path="file" getComponent={getHostFile}/>
        <Route path="setting" component={require('../components/Drive/Setting')}/>
        <Route path="location">
          <IndexRoute getComponent={getLocation}/>
          <Route path="new" getComponent={getLocationDetail}/>
          <Route path="pathname" getComponent={getLocationDetail}/>
        </Route>
      </Route>
    </Route>
  )

};


import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
import * as aphrodite from 'aphrodite'
import * as ReactRouterRedux from 'react-router-redux'
import ReactModal from 'react-modal'
import RenderApp from '@react-shared/render-app'
import defaults from 'lodash/defaults'
import {store, history, injectAsyncReducer} from './store'
import React, {Component } from 'react'

import ConnectCheckLogin from './CheckLogin'

const {ConnectedRouter} = ReactRouterRedux
const {Provider} = ReactRedux

console.log(global)

defaults(global, {
  __SMILE_DEV: process.env.NODE_ENV !== 'production',
  API_HOST: `https://api.youkuohao.com`,
  __SMILE_API: `https://api.youkuohao.com`
})

injectAsyncReducer('account', require('./actions/account/account').default)
injectAsyncReducer('drive', require('./actions/drive/drive').default)
injectAsyncReducer('file', require('./actions/file/file').default)
injectAsyncReducer('topic', require('./actions/topic/topic').default)
injectAsyncReducer('admin', require('./actions/admin').default)
injectAsyncReducer('nav', require('./actions/nav').default)
injectAsyncReducer('notice', require('./actions/notice').default)

SystemJS.set(SystemJS.normalizeSync('react'), SystemJS.newModule({'default': global.React , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-dom'), SystemJS.newModule({'default': global.ReactDOM , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-router-dom'), SystemJS.newModule({'default': ReactRouterDOM , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-redux'), SystemJS.newModule({'default': ReactRedux , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-router-redux'), SystemJS.newModule({'default': ReactRouterRedux , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('redux'), SystemJS.newModule({'default': Redux , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-modal'), SystemJS.newModule({'default': ReactModal , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('aphrodite'), SystemJS.newModule({'default': aphrodite , __useDefault: true }) );

SystemJS.config(global.__SYSTEM_CONFIG)


ReactDOM.render( 
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ConnectCheckLogin />
    </ConnectedRouter>
  </Provider>, 
  document.getElementById('app')
);

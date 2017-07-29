import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
import * as aphrodite from 'aphrodite'
import * as ReactRouterRedux from 'react-router-redux'
import ReactModal from 'react-modal'
import RenderApp from '@react-web/render'
import defaults from 'lodash/defaults'
import {store, history, injectAsyncReducer, AppWrapper} from '@react-web/store'
import React, {Component } from 'react'
import {HashRouter} from 'react-router-dom'
import './notice'
import './nav'

import App from './App'

const {ConnectedRouter} = ReactRouterRedux
const {Provider} = ReactRedux

const Router = HashRouter

defaults(global, {
  __SMILE_DEV: process.env.NODE_ENV !== 'production',
  API_HOST: `https://api.youkuohao.com`,
  __SMILE_API: `https://api.youkuohao.com`
})


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
  <AppWrapper>
    <Router>
      <App />
    </Router>
  </AppWrapper>,
  document.getElementById('app')
);
